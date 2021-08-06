"use strict";

var Homepage = Vue.component('homepage', {
  data: function data() {
    return {
      selectedLanguage: TibetanTransliteratorSettings.language,
      options: Storage.get('options') || {
        capitalize: true
      },
      tibetan: Storage.get('tibetan') || "\n        \u0F67\u0F75\u0F83\u0F14\n        \u0F68\u0F7C\u0F0B\u0F62\u0F92\u0FB1\u0F53\u0F0B\u0F61\u0F74\u0F63\u0F0B\u0F42\u0FB1\u0F72\u0F0B\u0F53\u0F74\u0F56\u0F0B\u0F56\u0FB1\u0F44\u0F0B\u0F58\u0F5A\u0F58\u0F66\u0F14\n        \u0F54\u0F51\u0FA8\u0F0B\u0F42\u0F7A\u0F0B\u0F66\u0F62\u0F0B\u0F66\u0FA1\u0F7C\u0F44\u0F0B\u0F54\u0F7C\u0F0B\u0F63\u0F14\n        \u0F61\u0F0B\u0F58\u0F5A\u0F53\u0F0B\u0F58\u0F46\u0F7C\u0F42\u0F0B\u0F42\u0F72\u0F0B\u0F51\u0F44\u0F7C\u0F66\u0F0B\u0F42\u0FB2\u0F74\u0F56\u0F0B\u0F56\u0F6A\u0F99\u0F7A\u0F66\u0F14\n        \u0F54\u0F51\u0FA8\u0F0B\u0F60\u0F56\u0FB1\u0F74\u0F44\u0F0B\u0F42\u0F53\u0F66\u0F0B\u0F5E\u0F7A\u0F66\u0F0B\u0F66\u0F74\u0F0B\u0F42\u0FB2\u0F42\u0F66\u0F14\n        \u0F60\u0F41\u0F7C\u0F62\u0F0B\u0F51\u0F74\u0F0B\u0F58\u0F41\u0F60\u0F0B\u0F60\u0F42\u0FB2\u0F7C\u0F0B\u0F58\u0F44\u0F0B\u0F54\u0F7C\u0F66\u0F0B\u0F56\u0F66\u0F90\u0F7C\u0F62\u0F14\n        \u0F41\u0FB1\u0F7A\u0F51\u0F0B\u0F40\u0FB1\u0F72\u0F0B\u0F62\u0F97\u0F7A\u0F66\u0F0B\u0F66\u0F74\u0F0B\u0F56\u0F51\u0F42\u0F0B\u0F56\u0F66\u0F92\u0FB2\u0F74\u0F56\u0F0B\u0F40\u0FB1\u0F72\u0F66\u0F14\n        \u0F56\u0FB1\u0F72\u0F53\u0F0B\u0F42\u0FB1\u0F72\u0F66\u0F0B\u0F56\u0F62\u0FB3\u0F56\u0F0B\u0F55\u0FB1\u0F72\u0F62\u0F0B\u0F42\u0F64\u0F7A\u0F42\u0F66\u0F0B\u0F66\u0F74\u0F0B\u0F42\u0F66\u0F7C\u0F63\u0F14\n        \u0F42\u0F74\u0F0B\u0F62\u0F74\u0F0B\u0F54\u0F51\u0FA8\u0F0B\u0F66\u0F72\u0F51\u0FA1\u0FB7\u0F72\u0F0B\u0F67\u0F75\u0F83\u0F14\n      ".replace(/ /g, '').trim()
    };
  },
  watch: {
    tibetan: function tibetan(value) {
      Storage.set('tibetan', value);
    }
  },
  computed: {
    lines: function lines() {
      return this.tibetan ? this.tibetan.split("\n") : [];
    }
  },
  template: "\n    <div class=\"ui fluid container\">\n      <language-menu v-model=\"selectedLanguage\"></language-menu>\n      <options-menu v-model=\"options\" />\n      <div id=\"scrollable-area-container\">\n        <clipboard-button v-if=\"tibetan\"></clipboard-button>\n        <div id=\"scrollable-area\">\n          <tibetan-input\n            v-model=\"tibetan\"\n            :allFields=\"['#tibetan']\"\n          ></tibetan-input>\n          <transliterated-lines\n            :lines=\"lines\"\n            :language=\"selectedLanguage\"\n            :options=\"options\"\n          ></transliterated-lines>\n        </div>\n      </div>\n    </div>\n  "
});
Vue.component('transliterated-lines', {
  props: {
    language: String,
    options: Object,
    lines: Array
  },
  computed: {
    transliteratedLines: function transliteratedLines() {
      var _this = this;

      TibetanTransliteratorSettings.change(this.language);
      return this.lines.map(function (line) {
        return new TibetanTransliterator(line, _this.options).transliterate();
      }).join("\n");
    }
  },
  template: "\n    <div class=\"ui form\">\n      <textarea id=\"transliteration\" readonly=\"\">{{transliteratedLines}}</textarea>\n    </div>\n  "
});