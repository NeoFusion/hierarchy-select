'use strict';
beforeEach(function () {
  // Add custom matchers
  jasmine.addMatchers({
    // Test if element is current active element
    toBeActiveElement: function () {
      return {
        compare: function (actual) {
          var result = {};

          result.pass = Promise.all([
            actual.equals(browser.driver.switchTo().activeElement()),
            actual.getTagName(),
          ])
            .then(function (resolved) {
              var equals = resolved[0];
              var tagName = resolved[1];

              if (equals) {
                result.message = 'Expected "' + tagName + '" not to be current active element';
              } else {
                result.message = 'Expected "' + tagName + '" to be current active element';
              }

              return equals;
            });

          return result;
        },
      };
    },
    // Test if element has class
    toHaveClass: function () {
      return {
        compare: function (actual, expected) {
          var result = {};

          result.pass = actual.getAttribute("class")
            .then(function (classes) {
              var pass = classes.split(" ").indexOf(expected) !== -1;

              if (pass) {
                result.message = 'Expected "' + classes + '" not to have class ' + expected;
              } else {
                result.message = 'Expected "' + classes + '" to have class ' + expected;
              }

              return pass;
            });

          return result;
        }
      };
    },
  });
});
