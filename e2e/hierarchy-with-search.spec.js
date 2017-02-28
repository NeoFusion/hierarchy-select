'use strict';
// Get page object
var page = require('./docs.po').exampleOne;

// Turn off angular support
browser.ignoreSynchronization = true;

describe('Hierarchy select with search and hierarchy', function () {
  beforeEach(function () {
    browser.get('/');
  });

  it('should open a drop-down and set focus on filter input field on initial click', function () {
    page.dropDownButton.click();

    var activeElement = browser.driver.switchTo().activeElement();
    expect(page.filterInput.equals(activeElement)).toBeTruthy();
    expect(page.root.getAttribute('class')).toContain('open');

  });

  it('should close drop-down on ESC or TAB key and set focus on drop-down button', function () {
    page.dropDownButton.click()
      .then(function() {
        return page.filterInput.sendKeys(protractor.Key.ESCAPE);
      })
      .then(function () {
        expect(page.root.getAttribute('class')).not.toContain('open');

        var activeElement = browser.driver.switchTo().activeElement();
        expect(page.dropDownButton.equals(activeElement)).toBeTruthy();

        return page.dropDownButton.click();
      })
      .then(function () {
        return page.filterInput.sendKeys(protractor.Key.TAB);
      })
      .then(function () {
        expect(page.root.getAttribute('class')).not.toContain('open');

        var activeElement = browser.driver.switchTo().activeElement();
        expect(page.dropDownButton.equals(activeElement)).toBeTruthy();
      });
  });

  it('should set first element in drop-down list active on initial click', function () {
    page.dropDownButton.click();
    expect(page.dropDownListElements.first().getAttribute('class')).toContain('active');
  });

  it('should navigate through elements on arrow keys up/down', function () {
    page.dropDownButton.click();
    expect(page.dropDownListElements.get(0).getAttribute('class')).toContain('active');
    page.filterInput.sendKeys(protractor.Key.ARROW_DOWN)
      .then(function () {
        expect(page.dropDownListElements.get(0).getAttribute('class')).not.toContain('active');
        expect(page.dropDownListElements.get(1).getAttribute('class')).toContain('active');

        return page.filterInput.sendKeys(protractor.Key.ARROW_UP);
      })
      .then(function () {
        expect(page.dropDownListElements.get(0).getAttribute('class')).toContain('active');
        expect(page.dropDownListElements.get(1).getAttribute('class')).not.toContain('active');
      });
  });

  it('should select currently active value after pressing enter', function () {
    var selectedValue;

    page.dropDownButton.click();
    expect(page.dropDownListElements.get(0).getAttribute('class')).toContain('active');

    page.filterInput.sendKeys(protractor.Key.ARROW_DOWN)
      .then(function () {
        return page.dropDownListElements.get(1).getAttribute('data-value');

      })
      .then(function (_selectedValue) {
        selectedValue = _selectedValue;

        return page.filterInput.sendKeys(protractor.Key.ENTER);
      })
      .then(function () {
        expect(page.valueHolder.getAttribute('value')).toBe(selectedValue);
      });
  });
});
