"use strict";

Vue.component('tibetan-input', {
  props: ['value'],
  methods: {
    checkInput: function checkInput(value) {
      var anyNonTibetanCharacter = /(?:[\0-\t\x0B-\x1F!-\x9F\xA1-\u0EFF\u0FDB-\u201F\u2021-\u25CB\u25CD-\u534C\u534E\u534F\u5351-\uD7FF\uE000-\uF020\uF043-\uF161\uF589-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/gi;
      var sanitized = value.replace(anyNonTibetanCharacter, '');
      $('#tibetan').val(sanitized);
      this.$emit('input', sanitized);
    },
    selectTextarea: function selectTextarea() {
      $('#tibetan').focus();
    }
  },
  template: "\n    <div class=\"ui form\" style=\"position: relative;\">\n      <div v-if=\"!value\" id=\"tibetan-placeholder\" @click=\"selectTextarea\">\n        Try inputing some Tibetan here...\n      </div>\n      <textarea\n        :value=\"value\"\n        @input=\"checkInput($event.target.value)\"\n        id=\"tibetan\"\n        class=\"tibetan\"\n        autofocus=\"true\"\n        spellcheck=\"false\"\n      ></textarea>\n    </div>\n  "
});