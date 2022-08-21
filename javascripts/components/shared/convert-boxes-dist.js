"use strict";

Vue.component('convert-boxes', {
  props: {
    setting: Object,
    tibetanStorageKey: String,
    options: {
      type: Object,
      "default": function _default() {
        return {};
      }
    }
  },
  data: function data() {
    return {
      tibetan: undefined
    };
  },
  watch: {
    tibetan: function tibetan(value) {
      Storage.set(this.tibetanStorageKey, value);
    }
  },
  computed: {
    lines: function lines() {
      return this.tibetan ? this.tibetan.split("\n") : [];
    }
  },
  created: function created() {
    var _this = this;

    Storage.get(this.tibetanStorageKey, "\n      \u0F67\u0F75\u0F83\u0F14\n      \u0F68\u0F7C\u0F0B\u0F62\u0F92\u0FB1\u0F53\u0F0B\u0F61\u0F74\u0F63\u0F0B\u0F42\u0FB1\u0F72\u0F0B\u0F53\u0F74\u0F56\u0F0B\u0F56\u0FB1\u0F44\u0F0B\u0F58\u0F5A\u0F58\u0F66\u0F14\n      \u0F54\u0F51\u0FA8\u0F0B\u0F42\u0F7A\u0F0B\u0F66\u0F62\u0F0B\u0F66\u0FA1\u0F7C\u0F44\u0F0B\u0F54\u0F7C\u0F0B\u0F63\u0F14\n      \u0F61\u0F0B\u0F58\u0F5A\u0F53\u0F0B\u0F58\u0F46\u0F7C\u0F42\u0F0B\u0F42\u0F72\u0F0B\u0F51\u0F44\u0F7C\u0F66\u0F0B\u0F42\u0FB2\u0F74\u0F56\u0F0B\u0F56\u0F6A\u0F99\u0F7A\u0F66\u0F14\n      \u0F54\u0F51\u0FA8\u0F0B\u0F60\u0F56\u0FB1\u0F74\u0F44\u0F0B\u0F42\u0F53\u0F66\u0F0B\u0F5E\u0F7A\u0F66\u0F0B\u0F66\u0F74\u0F0B\u0F42\u0FB2\u0F42\u0F66\u0F14\n      \u0F60\u0F41\u0F7C\u0F62\u0F0B\u0F51\u0F74\u0F0B\u0F58\u0F41\u0F60\u0F0B\u0F60\u0F42\u0FB2\u0F7C\u0F0B\u0F58\u0F44\u0F0B\u0F54\u0F7C\u0F66\u0F0B\u0F56\u0F66\u0F90\u0F7C\u0F62\u0F14\n      \u0F41\u0FB1\u0F7A\u0F51\u0F0B\u0F40\u0FB1\u0F72\u0F0B\u0F62\u0F97\u0F7A\u0F66\u0F0B\u0F66\u0F74\u0F0B\u0F56\u0F51\u0F42\u0F0B\u0F56\u0F66\u0F92\u0FB2\u0F74\u0F56\u0F0B\u0F40\u0FB1\u0F72\u0F66\u0F14\n      \u0F56\u0FB1\u0F72\u0F53\u0F0B\u0F42\u0FB1\u0F72\u0F66\u0F0B\u0F56\u0F62\u0FB3\u0F56\u0F0B\u0F55\u0FB1\u0F72\u0F62\u0F0B\u0F42\u0F64\u0F7A\u0F42\u0F66\u0F0B\u0F66\u0F74\u0F0B\u0F42\u0F66\u0F7C\u0F63\u0F14\n      \u0F42\u0F74\u0F0B\u0F62\u0F74\u0F0B\u0F54\u0F51\u0FA8\u0F0B\u0F66\u0F72\u0F51\u0FA1\u0FB7\u0F72\u0F0B\u0F67\u0F75\u0F83\u0F14\n    ".replace(/ /g, '').trim(), function (value) {
      _this.tibetan = value;
    });
  },
  mounted: function mounted() {
    $('#tibetan').autosize();
  },
  updated: function updated() {
    this.$nextTick(function () {
      return $(window).resize();
    });
  },
  template: "\n    <div class=\"scrollable-area-container\">\n      <clipboard-button v-if=\"tibetan\" />\n      <div class=\"scrollable-area\">\n        <tibetan-input v-model=\"tibetan\" />\n        <transliterated-lines\n          class=\"clipboard-target\"\n          :lines=\"lines\"\n          :setting=\"setting\"\n          :options=\"options\"\n        />\n      </div>\n    </div>\n  "
});
Vue.component('transliterated-lines', {
  props: {
    setting: Object,
    options: Object,
    lines: Array
  },
  computed: {
    processedLines: function processedLines() {
      var _this2 = this;

      rulesUsedForThisText = {};
      exceptionsUsedForThisText = {};
      var processedLines = this.lines.map(function (line) {
        var tibetanGroupsRegExp = /([\u0F00-\u0FDA\u2020\u25CC\u534D\u5350\uF021-\uF042\uF162-\uF588])+/gi;
        var tibetanParts = line.match(tibetanGroupsRegExp);

        if (tibetanParts) {
          var lineWithTibetanReplaced = line;
          tibetanParts.each(function (tibetanPart) {
            var transliterated = new TibetanTransliterator({
              setting: _this2.setting,
              capitalize: _this2.options.capitalize
            }).transliterate(tibetanPart);
            lineWithTibetanReplaced = lineWithTibetanReplaced.replace(tibetanPart, transliterated);
          });
          return {
            type: 'tibetan',
            source: line,
            text: lineWithTibetanReplaced
          };
        } else return {
          type: 'translation',
          text: line
        };
      });
      this.$store.commit('updateRulesUsedForThisText', rulesUsedForThisText);
      this.$store.commit('updateExceptionsUsedForThisText', exceptionsUsedForThisText);
      return processedLines;
    },
    processedLinesAsString: function processedLinesAsString() {
      return this.processedLines.map('text').join("\n").trim();
    },
    isAlternated: function isAlternated() {
      return !!this.processedLines.find({
        type: 'translation'
      });
    }
  },
  template: "\n    <div class=\"result\">\n      <template v-if=\"isAlternated || options.includeTibetan\">\n        <template v-for=\"(line, index) in processedLines\">\n          <template v-if=\"line.type == 'tibetan'\">\n            <div\n              v-if=\"options.includeTibetan\"\n              class=\"tibetan\"\n            >{{line.source}}</div>\n            <div class=\"transliteration\">{{line.text}}</div>\n          </template>\n          <div v-else class=\"translation\">{{line.text}}</div>\n        </template>\n      </template>\n      <template v-else>{{processedLinesAsString}}</template>\n    </div>\n  "
});