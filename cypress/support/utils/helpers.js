export function getRandomValueFromArray(_arr) {
  return _arr[Math.floor(Math.random() * _arr.length)];
}

export function handleCookies() {
  if (Cypress.$("div[id='ccc-notify']").length === 1) {
    cy.get("button[id='ccc-notify-accept']")
      .should("exist")
      .click()
      .should("not.exist");
  }
}

export function confirmPageTitle(title) {
  cy.title().should("eq", title);
}
