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

  module('Config#init', {
    // This will run before each test in this module.
    setup: function() {
      this.config = new Config();
    }
  });

  test('is init', function() {
    expect(1);
    var config = new Config();
    // Not a bad test to run on collection methods.
    strictEqual(this.config.version, config.version, 'should be chainable');
  });

}(this));
