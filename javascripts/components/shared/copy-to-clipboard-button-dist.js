"use strict";

Vue.component('copy-to-clipboard-button', {
  data: function data() {
    return {
      text: 'Copy'
    };
  },
  methods: {
    updateText: function updateText() {
      var that = this;
      this.text = 'Copied!';
      setTimeout(function () {
        that.text = 'Copy';
      }, 1000);
    }
  },
  mounted: function mounted() {
    new Clipboard('#copy-to-clipboard');
  },
  template: "\n    <div\n      id=\"copy-to-clipboard\"\n      class=\"ui button\"\n      data-clipboard-target=\".clipboard-target\"\n      @click=\"updateText\"\n    >\n      <i class=\"copy icon\"></i> {{text}}\n    </div>\n  "
});