"use strict";

var app = new Vue({
  router: router,
  data: function data() {
    return {
      colorMode: Storage.get('colorMode') || 'day'
    };
  },
  watch: {
    colorMode: function colorMode(value) {
      Storage.set('colorMode', value);
    }
  },
  methods: {
    toggleColorMode: function toggleColorMode() {
      this.colorMode = this.colorMode == 'night' ? 'day' : 'night';
    }
  },
  template: "\n    <div id=\"app\" :class=\"colorMode\">\n\n      <div\n        class=\"ui left vertical sidebar labeled icon menu\"\n        :class=\"{inverted: colorMode == 'night'}\"\n      >\n        <router-link class=\"item\" to=\"/\">\n          <i class=\"arrow right icon\"></i>\n          Convert\n        </router-link>\n        <router-link class=\"item\" to=\"/compare\">\n          <i class=\"fa fa-not-equal icon\"></i>\n          Compare\n        </router-link>\n        <router-link class=\"item\" to=\"/settings\">\n          <i class=\"cogs icon\"></i>\n          Settings\n        </router-link>\n      </div>\n\n      <div class=\"pusher\">\n\n        <button id=\"menu-button\" class=\"circular ui icon button\">\n          <i class=\"bars icon\"></i>\n        </button>\n\n        <button\n          id=\"color-mode-button\"\n          class=\"circular ui icon button\"\n          @click=\"toggleColorMode\"\n        >\n          <i class=\"adjust icon\"></i>\n        </button>\n\n        <transition name=\"fade\" mode=\"out-in\" appear>\n          <router-view></router-view>\n        </transition>\n\n      </div>\n\n    </div>\n  "
}).$mount('#app');