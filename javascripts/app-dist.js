"use strict";

if (navigator.storage && navigator.storage.persist) navigator.storage.persist();
var app;

var initializeStorage = function initializeStorage(callback) {
  var nbReady = 0;

  var callbackIfReady = function callbackIfReady() {
    nbReady++;
    if (nbReady >= 2) callback();
  };

  Settings.initializeFromStorage(callbackIfReady);
  Storage.get('ignoreGeneralExceptionsStorage', false, function (value) {
    ignoreGeneralExceptionsStorage = value;

    if (ignoreGeneralExceptionsStorage) {
      Exceptions.initializeFromDefaults();
      callbackIfReady();
    } else Exceptions.initializeFromStorage(callbackIfReady);
  });
};

$(function () {
  if (Storage.localStorageSupported()) {
    var colorMode = Storage.localStorageGet('colorMode');
    $('body').addClass(colorMode);
  }
});
initializeStorage(function () {
  app = new Vue({
    router: router,
    store: store,
    data: function data() {
      return {
        colorMode: undefined
      };
    },
    watch: {
      colorMode: function colorMode(value) {
        if (value == 'day') {
          $('body').addClass('day');
          $('body').removeClass('night');
        } else {
          $('body').addClass('night');
          $('body').removeClass('day');
        }

        localforage.setItem('colorMode', value);
        if (Storage.localStorageSupported()) Storage.localStorageSet('colorMode', value);
      }
    },
    methods: {
      toggleColorMode: function toggleColorMode() {
        this.colorMode = this.colorMode == 'night' ? 'day' : 'night';
      },
      toggleSidebar: function toggleSidebar() {
        $('.sidebar').sidebar('toggle');
      }
    },
    created: function created() {
      var _this = this;

      var defaultColorMode = 'day';
      localforage.getItem('colorMode').then(function (value) {
        return _this.colorMode = value || defaultColorMode;
      })["catch"](function (error) {
        return _this.colorMode = defaultColorMode;
      });
    },
    mounted: function mounted() {
      $('.sidebar').sidebar('setting', 'transition', 'overlay');
      $('.sidebar .item').click(function () {
        return $('.sidebar').sidebar('hide');
      });
      setTimeout(function () {
        return $('#loading-overlay').fadeOut();
      }, 500);
    },
    template: "\n      <div id=\"app\">\n\n        <div\n          class=\"ui left vertical sidebar labeled icon menu\"\n          :class=\"{inverted: colorMode == 'night'}\"\n        >\n          <div class=\"item logo\">\n            <img src=\"favicon.png\" />\n          </div>\n          <router-link class=\"item\" to=\"/\">\n            <i class=\"arrow right icon\"></i>\n            Convert\n          </router-link>\n          <router-link class=\"item\" to=\"/compare\">\n            <i class=\"fa fa-not-equal icon\"></i>\n            Compare\n          </router-link>\n          <router-link\n            class=\"item\" to=\"/settings\"\n            :class=\"{active: $route.name && ($route.name.match(/setting/) || $route.name.match(/exceptions/))}\"\n          >\n            <i class=\"cogs icon\"></i>\n            Settings\n          </router-link>\n        </div>\n\n        <div class=\"pusher\">\n\n          <button\n            id=\"menu-button\"\n            class=\"circular ui icon button\"\n            @click=\"toggleSidebar\"\n          >\n            <i class=\"bars icon\"></i>\n          </button>\n\n          <button\n            id=\"color-mode-button\"\n            class=\"circular ui icon button\"\n            @click=\"toggleColorMode\"\n          >\n            <i class=\"adjust icon\"></i>\n          </button>\n\n          <transition name=\"fade\" mode=\"out-in\" appear>\n            <router-view></router-view>\n          </transition>\n\n        </div>\n\n      </div>\n    "
  }).$mount('#app');
});