'use strict';

// Page object for the first example
module.exports.exampleOne = {
  dropDownList: element(by.css('#example-one')).element(by.css('ul')),
  dropDownListElements: element(by.css('#example-one')).all(by.css('li')),
  dropDownButton: element(by.css('#example-one')).element(by.css('.dropdown-toggle')),
  filterInput: element(by.css('#example-one')).element(by.css('.hs-searchbox input')),
  root: element(by.css('#example-one')),
  valueHolder: element(by.css('#example-one > input')),
};
