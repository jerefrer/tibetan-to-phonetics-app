"use strict";

Vue.component('back-button', {
  methods: {
    goBack: function goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
    }
  },
  template: "\n    <div id=\"back-button\" class=\"ui circular icon button\" @click=\"goBack\">\n      <i\n        class=\"left arrow icon\"\n      />\n    </div>\n  "
});