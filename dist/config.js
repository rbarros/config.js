/*! Config - v1.0.0 - 2014-02-19
* https://github.com/rbarros/config.js
* Copyright (c) 2014 Ramon Barros; Licensed MIT */
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

  /**
   * Constructor
   * @return {void}
   */
  Config.prototype.init = function() {
    console.log('Config ' + this.version);
  };

  /**
   * Check for file exits
   * @param  {string} url      file path
   * @param  {string} dataType return type
   * @return {mixed}           return false or ajax
   */
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

  /**
   * Makes loading the json configuration file.
   * @param  {string}   file     file path
   * @param  {Function} callback function callback
   * @return {json}             return json
   */
  Config.prototype.loadJson = function(file, callback) {
    var json;
    try {
      if (!file) {
        throw '[Config.loadJson] You must enter a file.';
      }
      json = this.fileExists(file, 'json');
      if (json === false) { throw '[Config.loadJson] File [' + file + '] not found.'; }
      if (typeof callback === 'function') {
          callback(json);
      }
    } catch(e) {
      console.warn(e);
    }
    return json;
  };

  /**
   * Loading the application settings
   * @param  {string} directory The configuration file directory
   * @return {void}
   */
  Config.prototype.loadConfig = function(directory) {
    this.settings = this.loadJson(this.baseurl + directory + '/config.json');
    if (typeof this.settings === 'object') {
        this.system = this.settings.system.type || "Type system not found!";
        var lang = this.settings.system.language || "pt";
        this.language[0] = {};
        this.language[0].def = lang;
        if(this.settings.system.debug === true){
            root.localStorage.debug = true;
        }else{
            delete root.localStorage.debug;
        }
    }
  };

  /**
   * Identifies the browser
   * @return {boolean} return true if the browser is IE
   */
  Config.prototype.browser = function() {
    var browser = root.navigator.appName,
        version = root.navigator.appVersion,
        thestart = parseFloat(version.indexOf("MSIE"))+1,
        browser_version = parseFloat(version.substring(thestart+4, thestart+7));
    if (browser === "Microsoft Internet Explorer" && browser_version >= 7) {
      return true;
    }
  };

  /**
   * Creates a cookie by passing the name, amount and date to expire.
   * @param {string} c_name name defined cookie
   * @param {mixed} value  value the cookie
   * @param {integer} day    date to expire
   */
  Config.setCookie = function(c_name, value, day) {
    var exdate = new Date(),
        d = day || 1;
    exdate.setHours(exdate.getHours() + d);
    var c_value = root.escape(value) + "; expires=" + exdate.toUTCString();
    root.document.cookie = c_name + "=" + c_value;
  };

  /**
   * Retrives the stored cookie
   * @param  {string} c_name name defined cookie
   * @return {mixed}        return value the cookie
   */
  Config.getCookie = function(c_name) {
    var i, x, y, ARRcookies = root.document.cookie.split(";"),
        r;

    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x === c_name) {
            r = root.unescape(y);
        }
    }
    return r;
  };

  var emptyArray = [], slice = emptyArray.slice,
      isArray = Array.isArray ||
      function(object){ return object instanceof Array; };

  function isPlainObject(obj) {
    return typeof obj === "object" && !(obj !== null && obj === obj.window) && Object.getPrototypeOf(obj) === Object.prototype;
  }

  function extend(target, source, deep) {
    var key;
    for (key in source) {
      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
          target[key] = {};
        }
        if (isArray(source[key]) && !isArray(target[key])) {
          target[key] = [];
          extend(target[key], source[key], deep);
        }
      } else if (source[key] !== undefined) {
        target[key] = source[key];
      }
    }
  }

  Config.prototype.extend = function(target) {
    var deep, args = slice.call(arguments, 1);
    if (typeof target === 'boolean') {
      deep = target;
      target = args.shift();
    }
    args.forEach(function(arg){ extend(target, arg, deep); });
    return target;
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
