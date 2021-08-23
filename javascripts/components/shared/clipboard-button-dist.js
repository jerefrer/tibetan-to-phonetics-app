"use strict";

Vue.component('clipboard-button', {
  data: function data() {
    return {
      text: 'Copy to clipboard'
    };
  },
  methods: {
    updateText: function updateText() {
      var that = this;
      this.text = 'Copied!';
      setTimeout(function () {
        that.text = 'Copy to clipboard';
      }, 1000);
    }
  },
  mounted: function mounted() {
    new Clipboard('#copy-to-clipboard');
  },
  template: "\n    <div\n      id=\"copy-to-clipboard\"\n      class=\"ui button\"\n      data-clipboard-target=\".clipboard-target\"\n      v-on:click=\"updateText\"\n    >\n      <i class=\"paste icon\"></i> {{text}}\n    </div>\n  "
});