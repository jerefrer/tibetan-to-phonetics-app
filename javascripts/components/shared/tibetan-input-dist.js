"use strict";

Vue.component('tibetan-input', {
  props: ['value'],
  methods: {
    selectTextarea: function selectTextarea() {
      $('#tibetan').focus();
    }
  },
  template: "\n    <div class=\"ui form\" style=\"position: relative;\">\n      <div v-if=\"!value\" id=\"tibetan-placeholder\" @click=\"selectTextarea\">\n        Try inputting some Tibetan here...\n      </div>\n      <textarea\n        :value=\"value\"\n        @input=\"$emit('input', $event.target.value)\"\n        id=\"tibetan\"\n        class=\"tibetan\"\n        autofocus=\"true\"\n        spellcheck=\"false\"\n      ></textarea>\n    </div>\n  "
});