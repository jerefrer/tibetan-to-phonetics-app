"use strict";

var Storage = {
  appKey: 'TibetanTransliterator',
  scopedKey: function scopedKey(keyName) {
    return this.appKey + '.' + keyName;
  },
  localStorageSupported: function localStorageSupported() {
    try {
      return !!window.localStorage;
    } catch (error) {
      return false;
    }

    ;
    return true;
  },
  localStorageSet: function localStorageSet(keyName, value) {
    var key = this.scopedKey(keyName);
    localStorage[key] = value;
  },
  localStorageGet: function localStorageGet(keyName) {
    var key = this.scopedKey(keyName);
    return localStorage[key];
  },
  get: function get(keyName, defaultValue, callback) {
    var jsonValue;
    var key = this.scopedKey(keyName);

    if (localforage._driver) {
      localforage.getItem(key).then(function (value) {
        return callback(value != undefined ? value : defaultValue);
      })["catch"](function (error) {
        return callback(defaultValue);
      });
    } else {
      jsonValue = Cookie.read(key);

      try {
        callback(jsonValue && JSON.parse(jsonValue) || defaultValue);
      } catch (e) {
        callback(defaultValue);
      }
    }
  },
  set: function set(keyName, value, callback) {
    var key = this.scopedKey(keyName);
    var jsonValue = JSON.stringify(value);
    if (localforage._driver) localforage.setItem(key, value).then(function (value) {
      if (callback) callback(value);
    });else {
      var tenYears = 87600;
      Cookie.write(key, jsonValue, tenYears);
      if (callback) callback(value);
    }
  },
  "delete": function _delete(keyName, callback) {
    var key = this.scopedKey(keyName);
    if (localforage._driver) localforage.removeItem(key).then(function () {
      if (callback) callback();
    });else {
      Cookie.remove(key);
      if (callback) callback();
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
}; // var Cookie = {
//   write: function(name, value, hours) {
//     let expire = '';
//     if (hours) {
//       expire = new Date((new Date()).getTime() + hours * 3600000);
//       expire = '; expires=' + expire.toGMTString();
//     }
//     var chunkSize = 1000;
//     var escapedValue = escape(value);
//     if (escapedValue.length > chunkSize) {
//       document.cookie = name + '=' + escape('--- COOKIE SPLIT ---') + expire;
//       var nbChunks = Math.ceil(escapedValue.length / chunkSize);
//       _(nbChunks).times((i) => {
//         var n = i + 1;
//         var splitKey = name + '-' + n;
//         var chunk = escapedValue.substring(chunkSize * i, chunkSize * n);
//         document.cookie = splitKey + '=' + chunk + expire;
//       })
//     }
//   },
//   read: function(name) {
//     let cookieValue = '',
//     search = name + '=';
//     if (document.cookie.length > 0) {
//       let cookie = document.cookie,
//       offset = cookie.indexOf(search);
//       if (offset !== -1) {
//         offset += search.length;
//         let end = cookie.indexOf(';', offset);
//         if (end === -1) {
//           end = cookie.length;
//         }
//         cookieValue = unescape(cookie.substring(offset, end));
//       }
//     }
//     return cookieValue;
//   },
//   remove: function(name) {
//     this.write(name, '', -1);
//   }
// }