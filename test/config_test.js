(function(window) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  module('Config', {
    // This will run before each test in this module.
    setup: function() {
      this.config = new Config();
      if (window.location.protocol === 'file:') {
        this.config.baseurl = 'http://localhost/config.js/';
      }
      this.baseurl = this.config.baseurl;
      this.json = {
          "debug":true,
          "language":"pt",
          "restfulUrl":"../src/",
          "defaultPage":"home",
          "perPage":12,
          "system": {
              "type":"client",
          }
      };
    }
  });

  test('test init', function() {
    expect(1);
    var config = new Config();
    strictEqual(this.config.version, config.version, 'should be chainable');
  });

  test('test fileExists', function() {
    expect(4);
    
    throws(
      function() {
        throw this.config.fileExists();
      },
      "Você deve informar a url"
    );
    throws(
      function() {
        throw this.config.fileExists();
      },
      "Você deve passar um objeto."
    );
    equal(this.config.fileExists(this.config.baseurl + '/config/config.json'), false);
    equal(this.config.fileExists(this.config.baseurl + '/test/config/config.json'), true);
  });

  test('test ajax not implemented', function() {
    throws(
      function() {
        delete Config.prototype.ajax;
        throw this.config.fileExists('/config/config.json', 'json');
      },
      "Ajax method not implemented!"
    );
  });

  test('test loadJson not set file or not found', function() {
    throws(
      function() {
        throw this.config.loadJson();
      },
      '[Config.loadJson] You must enter a file.'
    );

    throws(
      function() {
        throw this.config.loadJson('config/aaa.json');
      },
      '[Config.loadJson] File [config/aaa.json] not found.'
    );
  });

  /*
  test('test callback loadJson', function() {
    var self = this, json = false;
    this.config.loadJson('config/config.json', function(j) {
      json = j;
      equal(json, self.json, 'okay');
    });
  });
  */

}(this));
