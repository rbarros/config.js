/*
 * Config 2.2
 * https://github.com/rbarros/config.js
 *
 * Copyright (c) 2014 Ramon Barros
 * Licensed under the MIT license.
 */

(function (root) {
  'use strict';

  var Config = function() {
      this.version = "3.0";
      this.system = {};
      this.language = [];
      this.baseurl = root.location.protocol + '//' + root.location.host + root.location.pathname;
      this.client = {};
      this.setajax = {};
      this.settings = {};
      this.xmlhttp = {};
      this.restfulUrl = "../src/";
      this.api = {};
      this.errors = {};
      this.html = {};

      return this.init();
  };

  Config.prototype.init = function() {
    console.log('Config ' + this.version);
  };

  Config.prototype.fileExists = function(url, dataType) {
    var ajax = false;
    try {
      ajax = this.ajax({
        method: 'GET',
        url: url,
        dataType: dataType,
        data: ''
      });
    } catch(e) {
      throw 'Ajax method not implemented!';
    }
    return ajax;
  };

  Config.prototype.loadConfig = function(directory) {

  };

  /**
   * Ajax
   * @param {object} s settings to ajax
   * @return {object}
   */
  Config.prototype.ajax = function(s) {
      var async, method, url, self = this;
      this.setajax = s;
      try {
          if (!this.setajax.url) {
              throw 'Você deve informar a url.';
          }
          if (typeof this.setajax === 'object') {
              if (window.XMLHttpRequest) {
                  // IE7+, Firefox, Chrome, Opera, Safari
                  this.xmlhttp = new XMLHttpRequest();
              } else {
                  // IE6, IE5
                  this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
              }
              this.xmlhttp.onreadystatechange = function() {
                  if (self.xmlhttp.readyState === 4 && self.xmlhttp.status === 200) {
                      if (self.setajax.dataType === 'json') {
                          self.setajax.responseText = JSON.parse(self.xmlhttp.responseText); //eval('(' + self.xmlhttp.responseText + ')');
                      } else {
                          self.setajax.responseText = self.xmlhttp.responseText;
                      }
                  }
              };
              method = this.setajax.method || 'GET';
              url = this.setajax.url || this.baseurl;
              async = this.setajax.async || false;
              this.xmlhttp.open(method, url, async);
              if (this.setajax.data) {
                  this.xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                  this.xmlhttp.send(JSON.stringify(this.setajax.data));
              } else {
                  this.xmlhttp.send();
              }
              if (this.setajax.success && typeof this.setajax.success === 'function') {
                  this.setajax.success(this.setajax.responseText);
              }
          } else {
              throw 'Você deve passar um objeto. ';
          }
      } catch(e) {
          if (this.setajax.error && typeof this.setajax.error === 'function') {
              this.setajax.error(e);
          }
      }
      return this.xmlhttp;
  };

  // Export the Underscore object for **Node.js** and **"CommonJS"**, with
  // backwards-compatibility for the old `require()` API. If we're not in
  // CommonJS, add `_` to the global object via a string identifier for
  // the Closure Compiler "advanced" mode. Registration as an AMD module
  // via define() happens at the end of this file.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Config;
    }
    exports.Config = Config;
  } else {
    root['Config'] = Config;
  }

    // AMD define happens at the end for compatibility with AMD loaders
  // that don't enforce next-turn semantics on modules.
  if (typeof define === 'function' && define.amd) {
    define('config', function() {
      return Config;
    });
  }
})(this);
