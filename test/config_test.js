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
    var ajax = Config.prototype.ajax;
    expect(1);
    throws(
      function() {
        delete Config.prototype.ajax;
        throw this.config.fileExists('/config/config.json', 'json');
      },
      "Ajax method not implemented!"
    );
    Config.prototype.ajax = ajax;
  });

  test('test loadJson not set file or not found', function() {
    expect(2);
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

  
  test('test file json equal - loadJson', function() {
    expect(1);
    var self = this;
    this.config.loadJson(this.config.baseurl + '/test/config/config.json', function(json) {
      deepEqual(json, self.json, 'okay');
    });
  });

  test('test loadConfig', function() {
    expect(1);
    deepEqual(this.config.loadConfig('test/config'), this.json, 'okay');
  });

  test('test cookies', function() {
    this.config.setCookie('config.js', this.config.version, 1);
    equal(this.config.version, this.config.getCookie('config.js'));
  });

  test('test extend - Merge object2 into object1', function() {
    var object1 = {
      apple: 0,
      banana: { weight: 52, price: 100 },
      cherry: 97
    };
    var object2 = {
      banana: { price: 200 },
      durian: 100
    };
    deepEqual({"apple":0,"banana":{"price":200},"cherry":97,"durian":100}, this.config.extend(object1, object2), 'okay');
  });

  /*
  test('test extend - Merge object2 into object1, recursively', function() {
    var object1 = {
      apple: 0,
      banana: { weight: 52, price: 100 },
      cherry: 97
    };
    var object2 = {
      banana: { price: 200 },
      durian: 100
    };
    deepEqual({"apple":0,"banana":{"weight":52,"price":200},"cherry":97,"durian":100}, this.config.extend(true, object1, object2), 'okay');
  });
  */

  test('test extend - Merge defaults and options, without modifying defaults', function() {
    var defaults = { validate: false, limit: 5, name: "foo" };
    var options = { validate: true, name: "bar" };

    // Merge defaults and options, without modifying defaults
    var settings = this.config.extend( {}, defaults, options );
    deepEqual({"validate":true,"limit":5,"name":"bar"}, settings);
  });



}(this));
