import "./commands";
import "cypress-pipe";
const addContext = require("mochawesome/addContext");

//Build a cucumber test report using mochawesome reporting
Cypress.on("test:after:run", (test, runnable) => {
  const spec_title = runnable.parent.title;
  const scenarioName = window.testState.currentScenario.name;
  const stepResult = window.testState.stepResults;

  window.testState.scenarioSteps[scenarioName].forEach(function (
    currStep,
    index
  ) {
    addContext(
      { test },
      {
        title: currStep.keyword + " " + currStep.text,
        value: String(stepResult[index].status).toUpperCase(),
      }
    );
  });

  if (test.state === "failed") {
    addContext(
      { test },
      {
        title:
          "Failing Screenshot: " +
          ">> screenshots/" +
          Cypress.spec.name +
          "/" +
          spec_title +
          " -- " +
          test.title +
          " (failed)" +
          ".png <<",
        value:
          "screenshots/" +
          Cypress.spec.name +
          "/" +
          spec_title +
          " -- " +
          test.title +
          " (failed)" +
          ".png",
      }
    );
  }
});
