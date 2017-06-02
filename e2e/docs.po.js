'use strict';
module.exports.ExamplePage = function (_section) {
  var section = '#' + _section;
  var self = this;

  // Set a reference to the first example root element
  this.root = element(by.css(section));

  // Set references to main elements
  this.defaultSelected = this.root.element(by.css('[data-default-selected]'));
  this.dropDownButton = this.root.element(by.css('.dropdown-toggle'));
  this.dropDownList = this.root.element(by.css('ul'));
  this.dropDownListElements = this.root.all(by.css('li'));
  this.filterInput = this.root.element(by.css('.hs-searchbox input'));
  this.valueHolder = element(by.css(section + ' > input'));

  this.getCurrentValue = function () {
    return self.valueHolder.getAttribute('value');
  };

  this.getListElement = function (index) {
    return self.dropDownListElements.get(index);
  };

  this.openDropDown = function () {
    return self.dropDownButton.click();
  };

  this.setFilter = function (value) {
    return self.filterInput.sendKeys(value);
  }
};
