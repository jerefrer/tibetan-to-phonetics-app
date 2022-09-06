"use strict";

Vue.component('tibetan-input', {
  props: ['value'],
  methods: {
    selectTextarea: function selectTextarea() {
      $('#tibetan').focus();
    }
  },
  template: "\n    <div\n      class=\"ui form\"\n      style=\"position: relative;\"\n    >\n\n      <paste-from-clipboard-button\n        @paste=\"$emit('input', $event)\"\n      />\n\n      <div\n        v-if=\"!value\"\n        id=\"tibetan-placeholder\"\n        @click=\"selectTextarea\"\n      >\n        Try inputting some Tibetan here...\n      </div>\n\n      <textarea\n        id=\"tibetan\"\n        class=\"tibetan\"\n        autofocus=\"true\"\n        spellcheck=\"false\"\n        :value=\"value\"\n        @input=\"$emit('input', $event.target.value)\"\n      />\n\n    </div>\n  "
});