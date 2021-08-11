"use strict";

var ConvertPage = Vue.component('convert-page', {
  data: function data() {
    return {
      selectedLanguageId: Storage.get('selectedLanguageId') || Languages.defaultLanguageId,
      options: Storage.get('options') || {
        capitalize: true
      },
      tibetan: Storage.get('tibetan') || "\n        \u0F67\u0F75\u0F83\u0F14\n        \u0F68\u0F7C\u0F0B\u0F62\u0F92\u0FB1\u0F53\u0F0B\u0F61\u0F74\u0F63\u0F0B\u0F42\u0FB1\u0F72\u0F0B\u0F53\u0F74\u0F56\u0F0B\u0F56\u0FB1\u0F44\u0F0B\u0F58\u0F5A\u0F58\u0F66\u0F14\n        \u0F54\u0F51\u0FA8\u0F0B\u0F42\u0F7A\u0F0B\u0F66\u0F62\u0F0B\u0F66\u0FA1\u0F7C\u0F44\u0F0B\u0F54\u0F7C\u0F0B\u0F63\u0F14\n        \u0F61\u0F0B\u0F58\u0F5A\u0F53\u0F0B\u0F58\u0F46\u0F7C\u0F42\u0F0B\u0F42\u0F72\u0F0B\u0F51\u0F44\u0F7C\u0F66\u0F0B\u0F42\u0FB2\u0F74\u0F56\u0F0B\u0F56\u0F6A\u0F99\u0F7A\u0F66\u0F14\n        \u0F54\u0F51\u0FA8\u0F0B\u0F60\u0F56\u0FB1\u0F74\u0F44\u0F0B\u0F42\u0F53\u0F66\u0F0B\u0F5E\u0F7A\u0F66\u0F0B\u0F66\u0F74\u0F0B\u0F42\u0FB2\u0F42\u0F66\u0F14\n        \u0F60\u0F41\u0F7C\u0F62\u0F0B\u0F51\u0F74\u0F0B\u0F58\u0F41\u0F60\u0F0B\u0F60\u0F42\u0FB2\u0F7C\u0F0B\u0F58\u0F44\u0F0B\u0F54\u0F7C\u0F66\u0F0B\u0F56\u0F66\u0F90\u0F7C\u0F62\u0F14\n        \u0F41\u0FB1\u0F7A\u0F51\u0F0B\u0F40\u0FB1\u0F72\u0F0B\u0F62\u0F97\u0F7A\u0F66\u0F0B\u0F66\u0F74\u0F0B\u0F56\u0F51\u0F42\u0F0B\u0F56\u0F66\u0F92\u0FB2\u0F74\u0F56\u0F0B\u0F40\u0FB1\u0F72\u0F66\u0F14\n        \u0F56\u0FB1\u0F72\u0F53\u0F0B\u0F42\u0FB1\u0F72\u0F66\u0F0B\u0F56\u0F62\u0FB3\u0F56\u0F0B\u0F55\u0FB1\u0F72\u0F62\u0F0B\u0F42\u0F64\u0F7A\u0F42\u0F66\u0F0B\u0F66\u0F74\u0F0B\u0F42\u0F66\u0F7C\u0F63\u0F14\n        \u0F42\u0F74\u0F0B\u0F62\u0F74\u0F0B\u0F54\u0F51\u0FA8\u0F0B\u0F66\u0F72\u0F51\u0FA1\u0FB7\u0F72\u0F0B\u0F67\u0F75\u0F83\u0F14\n      ".replace(/ /g, '').trim()
    };
  },
  watch: {
    tibetan: function tibetan(value) {
      Storage.set('tibetan', value);
    },
    selectedLanguageId: function selectedLanguageId(value) {
      Storage.set('selectedLanguageId', value);
    }
  },
  computed: {
    lines: function lines() {
      return this.tibetan ? this.tibetan.split("\n") : [];
    }
  },
  methods: {
    updateBoxesHeight: function updateBoxesHeight() {
      $('#tibetan').autosize();
      setTimeout(function () {
        $('#transliteration').css('height', $('textarea.tibetan').css('height'));
      }, 0);
    }
  },
  mounted: function mounted() {
    this.updateBoxesHeight();
  },
  updated: function updated() {
    this.updateBoxesHeight();
  },
  template: "\n    <div class=\"ui fluid container\">\n      <div id=\"menu\">\n        <language-menu v-model=\"selectedLanguageId\" />\n        <slider-checkbox\n          v-model=\"options.capitalize\"\n          text=\"Capital letter at the beginning of each group\"\n        />\n      </div>\n      <div id=\"scrollable-area-container\">\n        <clipboard-button v-if=\"tibetan\" />\n        <div id=\"scrollable-area\">\n          <tibetan-input v-model=\"tibetan\" />\n          <transliterated-lines\n            :lines=\"lines\"\n            :languageId=\"selectedLanguageId\"\n            :options=\"options\"\n          />\n        </div>\n      </div>\n    </div>\n  "
});
Vue.component('transliterated-lines', {
  props: {
    languageId: String,
    options: Object,
    lines: Array
  },
  computed: {
    transliteratedLines: function transliteratedLines() {
      var _this = this;

      var language = Languages.find(this.languageId);
      return this.lines.map(function (line) {
        return new TibetanTransliterator(line, language, _this.options).transliterate();
      }).join("\n");
    }
  },
  template: "\n    <div class=\"ui form\">\n      <textarea id=\"transliteration\" readonly=\"\">{{transliteratedLines}}</textarea>\n    </div>\n  "
});