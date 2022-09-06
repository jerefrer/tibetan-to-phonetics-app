"use strict";

Vue.component('paste-from-clipboard-button', {
  methods: {
    pasteFromClipBoard: function pasteFromClipBoard() {
      var _this = this;

      navigator.clipboard.readText().then(function (value) {
        _this.$emit('paste', value);
      });
    }
  },
  template: "\n    <div\n      id=\"paste-from-clipboard\"\n      class=\"ui button\"\n      @click=\"pasteFromClipBoard\"\n    >\n      <i class=\"paste icon\"></i> Paste\n    </div>\n  "
});