"use strict";

var Storage = {
  appKey: 'TibetanTransliterator',
  localStorageSupported: function localStorageSupported() {
    try {
      return !!window.localStorage;
    } catch (error) {
      return false;
    }

    ;
    return true;
  },
  scopedKey: function scopedKey(keyName) {
    return this.appKey + '.' + keyName;
  },
  get: function get(keyName) {
    var jsonValue;
    var key = this.scopedKey(keyName);
    if (this.localStorageSupported()) jsonValue = localStorage[key];else jsonValue = Cookie.read(key);
    return jsonValue && JSON.parse(jsonValue);
  },
  set: function set(keyName, value) {
    var key = this.scopedKey(keyName);
    var jsonValue = JSON.stringify(value);
    if (this.localStorageSupported()) localStorage[key] = jsonValue;else {
      var tenYears = 87600;
      Cookie.write(key, jsonValue, tenYears);
    }
    return true;
  },
  "delete": function _delete(keyName) {
    var key = this.scopedKey(keyName);
    if (this.localStorageSupported()) delete localStorage[key];else {
      Cookie.remove(key);
    }
  }
};
var Cookie = {
  write: function write(name, value, hours) {
    var expire = '';

    if (hours) {
      expire = new Date(new Date().getTime() + hours * 3600000);
      expire = '; expires=' + expire.toGMTString();
    }

    document.cookie = name + '=' + escape(value) + expire;
  },
  read: function read(name) {
    var cookieValue = '',
        search = name + '=';

    if (document.cookie.length > 0) {
      var cookie = document.cookie,
          offset = cookie.indexOf(search);

      if (offset !== -1) {
        offset += search.length;
        var end = cookie.indexOf(';', offset);

        if (end === -1) {
          end = cookie.length;
        }

        cookieValue = unescape(cookie.substring(offset, end));
      }
    }

    return cookieValue;
  },
  remove: function remove(name) {
    this.write(name, '', -1);
  }
};