'use strict';
// Get page object
var ExamplePage = require('./docs.po').ExamplePage;

// Turn off angular support
browser.ignoreSynchronization = true;

describe('Hierarchy select with search and hierarchy', function () {
  var examplePage;

  beforeEach(function () {
    browser.get('/');
    examplePage = new ExamplePage('example-one');
  });

  it('should open a drop-down and set focus on filter input field on initial click', function () {
    examplePage.openDropDown();

    expect(examplePage.filterInput).toBeActiveElement();
    expect(examplePage.root).toHaveClass('open');
  });

  it('should close drop-down on ESC or TAB key and set focus on drop-down button', function () {
    Promise.all([
      examplePage.openDropDown(),
      examplePage.setFilter(protractor.Key.ESCAPE),
    ])
      .then(function () {
        expect(examplePage.root).not.toHaveClass('open');
        expect(examplePage.dropDownButton).toBeActiveElement();

        return Promise.all([
          examplePage.openDropDown(),

          examplePage.setFilter(protractor.Key.TAB),
        ]);
      })
      .then(function () {
        expect(examplePage.root).not.toHaveClass('open');
        expect(examplePage.dropDownButton).toBeActiveElement();
      });
  });

  it('should set first element in drop-down list active on initial click', function () {
    examplePage.openDropDown();

    expect(examplePage.getListElement(0)).toHaveClass('active');
  });

  it('should navigate through elements on arrow keys up/down', function () {
    examplePage.openDropDown();

    expect(examplePage.getListElement(0)).toHaveClass('active');

    examplePage.setFilter(protractor.Key.ARROW_DOWN)
      .then(function () {
        expect(examplePage.getListElement(0)).not.toHaveClass('active');
        expect(examplePage.getListElement(1)).toHaveClass('active');

        return examplePage.setFilter(protractor.Key.ARROW_UP);
      })
      .then(function () {
        expect(examplePage.getListElement(0)).toHaveClass('active');
        expect(examplePage.getListElement(1)).not.toHaveClass('active');
      });
  });

  it('should select currently active value after pressing enter', function () {
    var selectedValue = '';

    examplePage.openDropDown();

    expect(examplePage.getListElement(0)).toHaveClass('active');

    Promise.all([
      examplePage.setFilter(protractor.Key.ARROW_DOWN),
      examplePage.getListElement(1).getAttribute('data-value'),
    ])
      .then(function (resolved) {
        selectedValue = resolved[1];
        return examplePage.setFilter(protractor.Key.ENTER);
      })
      .then(function () {
        expect(examplePage.getCurrentValue()).toBe(selectedValue);
      });
  });

  it('should have the value of an element with the attribute `data-default-selected` be the default value', function () {
    examplePage.defaultSelected.isPresent()
      .then(function (isPresent) {
        if (isPresent) {
          expect(examplePage.defaultSelected.getAttribute('data-value')).toBe(examplePage.getCurrentValue());
        }
      });
  });
});
