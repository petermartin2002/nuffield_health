import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";
import {
  getRandomValueFromArray,
  handleCookies,
  confirmPageTitle,
} from "../../support/utils/helpers";

beforeEach(() => {
  cy.fixture("gyms.json").then(($gyms) => {
    cy.wrap($gyms).as("gyms");
  });

  //Preserve the cookies to prevent repeatedly needing to accept cookies dialog
  Cypress.Cookies.preserveOnce(
    "CookieControl",
    "_gat_UA-1566310-2",
    "_gid",
    "_gcl_au",
    "_tt_enable_cookie",
    "_ttp",
    "__qca",
    "_ga"
  );
});

//navigation to the home page
Given("I open the Nuffield Health home page", () => {
  //Uses baseURL in cypress.json
  cy.visit("");
  cy.get("body")
    .should("exist")
    .then(() => {
      handleCookies();

      confirmPageTitle(
        "Gyms, Health Clubs, Fitness & Wellbeing | Nuffield Health"
      );
    });
});

//naviage to the Nuffield Health home page
Given(
  "I open the Nuffield Health home page using geolocation: {string}",
  (postcode) => {
    //Using the short postcode select a valid postcode from the returned list
    cy.request(`api.postcodes.io/postcodes?q=${postcode}`)
      .its("body")
      .then(($body) => {
        const randomPostcode = getRandomValueFromArray($body.result);

        cy.visit("", {
          onBeforeLoad(win) {
            //force geolocation by using the lat and long of the random postcode
            const latitude = randomPostcode.latitude;
            const longitude = randomPostcode.longitude;
            cy.stub(win.navigator.geolocation, "getCurrentPosition").callsFake(
              (cb) => {
                return cb({ coords: { latitude, longitude } });
              }
            );
          },
        });
        cy.get("body")
          .should("exist")
          .then(() => {
            handleCookies();

            confirmPageTitle(
              "Gyms, Health Clubs, Fitness & Wellbeing | Nuffield Health"
            );
          });
      });
  }
);

//Serach gyms based on the postcode
When("I perform a search for gyms in/using {string}", (postcode) => {
  if (postcode === "My Location") {
    cy.get("a").contains("Or use my current location").should("exist").click();
  } else {
    cy.get("div[class='hero-location-finder__search']").as("locationSearch");
    cy.get("@locationSearch").should("exist").find("input").type(postcode);
  }
});

And("I confirm the location {string} exists", (location) => {
  cy.waitUntil(
    () =>
      cy
        //NB this was working on Friday afernoon (16:3013/05/2022).
        //I suspect maybe a release has occured in the interim.
        // .get("div[class='pac-container pac-logo']")

        //revised (21:51 16/05/2022)
        .get("div[class='pac-item']")
        .find("span")
        .contains(`${location}`)
        .click(),
    {
      timeout: 10000,
      interval: 500,
    }
  );
});

//Asserting the first gyms returned for search
Then(
  "I verify the results returned contain the following gyms {string}",
  ($returnedGyms) => {
    const gymsList = $returnedGyms.split(", ");

    //Loop through all the gyms
    for (const gym of gymsList) {
      cy.get("@gyms").then(($gymData) => {
        //Extract specific gym data the gym from the expected data
        const gymData = $gymData.find(($gym) => $gym.name === gym);

        cy.get("span[class='js-location-name']")
          .contains(gymData.name)
          .should("exist")
          //I would introduce ids to make this less ugly,
          //if I had access to the source code
          .parent()
          .parent()
          .then(($actualData) => {
            //I would provide a unique id or itemname for the 2 street address fields
            expect(
              Cypress.$($actualData)
                .find("span[itemname='streetAddress']:nth-child(1)")
                .text()
            ).to.equal(gymData.address1);

            expect(
              Cypress.$($actualData)
                .find("span[itemname='streetAddress']:nth-child(3)")
                .text()
            ).to.equal(gymData.address2);

            expect(
              Cypress.$($actualData)
                .find("span[itemname='addressLocality']")
                .text()
            ).to.equal(gymData.city);

            expect(
              Cypress.$($actualData).find("span[itemname='postalCode']").text()
            ).to.equal(gymData.postcode);

            expect(
              Cypress.$($actualData).find("span[itemprop='telephone']").text()
            ).to.equal(gymData.phoneNumber);
          });
      });
    }
  }
);
