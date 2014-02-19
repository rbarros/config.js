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
      this.baseurl = this.config.baseurl;
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
      "Você deve informar a url",
      "Você deve informar a url."
    );
    throws(
      function() {
        throw this.config.fileExists();
      },
      "Você deve passar um objeto.",
      "Você deve passar um objeto."
    );
    if (this.config.baseurl === 'file:///private') {
      this.config.baseurl = 'http://localhost/config.js/';
    }
    equal(this.config.fileExists(this.config.baseurl + '/config/config.json'), false);
    equal(this.config.fileExists(this.config.baseurl + '/test/config/config.json'), true);
  });

}(this));
