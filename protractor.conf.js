var SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './e2e/**/*.spec.js'
  ],
  capabilities: {
    'browserName': 'chrome',
    chromeOptions: {
      args: [ "--headless", "--disable-gpu", "--no-sandbox", "--window-size=1920x1080" ]
    }
  },
  directConnect: true,
  baseUrl: 'http://localhost:8081/demo',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare: function() {
    jasmine.getEnv().addReporter(new SpecReporter());
    require('./e2e/addons');
  }
};
