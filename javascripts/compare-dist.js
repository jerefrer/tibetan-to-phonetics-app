"use strict";

var updateHeight = function updateHeight() {
  var all = ['#tibetan', '#transliteration', '#transliterated'];
  $(all.join(',')).css('height', 'auto').autosize();
  var highest = all.max(function (element) {
    return $(element).height();
  });
  var others = all.exclude(highest);
  $(highest).autosize();
  setTimeout(function () {
    var height = $(highest).css('height');

    _(others).each(function (element) {
      $(element).css('height', height);
    });
  }, 0);
};

var extractTransliteration = function extractTransliteration(text) {
  var lines = text.split("\n");
  var transliterationLines = [];

  _(lines).each(function (line) {
    if (line.match(/^[A-Z][ ]*\d*$/)) return; // Page number

    if (line.match(/[ÂĀÊĒÎĪÔŌṐÛŪâāêēîīôōûūf1-9\,\;\.\:\!\?\*\_\(\)]/)) return; // Translation line

    transliterationLines.push(line);
  });

  return transliterationLines.join("\n");
};

var app;
$(function () {
  Vue.component('transliteration-input', {
    props: ['value'],
    template: "\n      <div class=\"ui form\" style=\"position: relative;\">\n        <div v-if=\"!value\" id=\"tibetan-placeholder\">\n          Input the transliteration here...\n        </div>\n        <textarea\n          v-bind:value=\"value\"\n          v-on:input=\"$emit('input', $event.target.value)\"\n          spellcheck=\"false\"\n          id=\"transliteration\"\n        ></textarea>\n      </div>\n    ",
    mounted: function mounted() {
      var that = this;
      $('#transliteration').autosize();
      $('#transliteration').on('paste', function (event) {
        event.preventDefault();
        var pastedData = event.originalEvent.clipboardData.getData('text/plain');
        that.$emit('paste', extractTransliteration(pastedData));
        setTimeout(function () {
          //$('#transliteration').trigger('input');
          updateHeight();
        }, 100);
      });
    }
  });
  Vue.component('transliterated-lines', {
    props: {
      expectedTransliteration: String,
      language: String,
      lines: Array
    },
    methods: {
      expectedLines: function expectedLines() {
        return this.expectedTransliteration.split("\n");
      },
      emitClickPart: function emitClickPart(result) {
        this.$emit('click-part', result);
      }
    },
    computed: {
      transliteratedLines: function transliteratedLines() {
        var that = this;
        TibetanTransliteratorSettings.change(this.language);
        return this.lines.map(function (line, index) {
          return {
            expected: that.expectedLines()[index],
            actual: new TibetanTransliterator(line).transliterate().capitalize()
          };
        });
      }
    },
    template: "\n      <div id=\"transliterated\">\n        <test-diff\n          class=\"line\"\n          v-for=\"(line, index) in transliteratedLines\"\n          v-bind:key=\"index\"\n          v-bind:lineIndex=\"index\"\n          v-bind:expected=\"line.expected\"\n          v-bind:actual=\"line.actual\"\n          v-on:click-part=\"emitClickPart($event)\"\n        ></test-diff>\n      </div>\n    "
  });
  Vue.component('test-diff', {
    props: {
      lineIndex: Number,
      expected: String,
      actual: String
    },
    computed: {
      parts: function parts() {
        return JsDiff.diffChars(this.expected, this.actual);
      }
    },
    methods: {
      emitClickPart: function emitClickPart(clickedPart, clickedPartIndex) {
        var parts = this.parts;
        var updatedLine = '';

        _(parts).each(function (part, index) {
          if (clickedPart == parts[index - 1] && part.added) updatedLine += part.value;else if (clickedPart == part && part.added) updatedLine += part.value;else {
            if (part.removed && !(clickedPart == part) && !(clickedPart == parts[index + 1] && parts[index + 1].added)) updatedLine += part.value;
            if (!part.removed && !part.added) updatedLine += part.value;
          }
        });

        this.$emit('click-part', {
          lineIndex: this.lineIndex,
          updatedLine: updatedLine
        });
      }
    },
    template: "\n      <div>\n        <span\n          v-for=\"(part, partIndex) in parts\"\n          v-on:click=\"(part.added || part.removed) && emitClickPart(part, partIndex)\"\n          v-bind:style=\"[part.added ? {color: '#2185d0', 'font-weight': 'bold'} : '', part.removed ? {color: '#db2828', 'font-weight': 'bold'} : '']\"\n          >{{part.added || part.removed ? part.value.replace(/ /, '_') : part.value}}</span>\n      </div>\n    "
  });
  app = new Vue({
    el: '#main',
    data: {
      selectedLanguage: TibetanTransliteratorSettings.language,
      transliteration: Storage.get('compareTransliteration') || "\n        L\xFCpa m\xE9par gukpar n\xFCma\n        Chatsal gyachin m\xE9lha tsangpa\n        Lung lha natsok wangchuk ch\xF6ma\n        Jungpo rolang triza namtang\n        N\xF6jin tsokyi d\xFCn\xE9 t\xF6ma\n        Chatsal trat\u2019ch\xE9 chatang phet\u2019kyi\n        Par\xF6l tr\xFClkhor raptu jomma\n        Yekum y\xF6nkyang shapkyi nent\xE9\n        M\xE9bar trukpa shintu barma\n        Chatsal tur\xE9 jikpa ch\xE9np\xF6\n        D\xFCkyi pawo nampar jomma\n        Chuky\xE9 shalni tro ny\xE9r dendz\xE9\n        Drawo tamch\xE9 mal\xFC s\xF6ma\n        Chatsal k\xF6nchok sumts\xF6n chakgy\xE9\n        Sorm\xF6 tukar nampar gyenma\n        Mal\xFC chokyi khorl\xF6 gyenp\xE9\n        Rangki \xF6kyi tsoknam trukma\n        Chatsal raptu gawa jip\xE9\n        U-gyen \xF6kyi tr\xE9ngwa p\xE9lma\n      ".replace(/^[ ]*/gm, '').trim(),
      tibetan: Storage.get('compareTibetan') || "\n        \u0F63\u0F74\u0F66\u0F0B\u0F54\u0F0B\u0F58\u0F7A\u0F51\u0F0B\u0F54\u0F62\u0F0B\u0F60\u0F42\u0F74\u0F42\u0F66\u0F0B\u0F54\u0F62\u0F0B\u0F53\u0F74\u0F66\u0F0B\u0F58\u0F0D \u0F0D\n        \u0F55\u0FB1\u0F42\u0F0B\u0F60\u0F5A\u0F63\u0F0B\u0F56\u0F62\u0F92\u0FB1\u0F0B\u0F56\u0FB1\u0F72\u0F53\u0F0B\u0F58\u0F7A\u0F0B\u0F63\u0FB7\u0F0B\u0F5A\u0F44\u0F66\u0F0B\u0F54\u0F0D \u0F0D\n        \u0F62\u0FB3\u0F74\u0F44\u0F0B\u0F63\u0FB7\u0F0B\u0F66\u0FA3\u0F0B\u0F5A\u0F7C\u0F42\u0F66\u0F0B\u0F51\u0F56\u0F44\u0F0B\u0F55\u0FB1\u0F74\u0F42\u0F0B\u0F58\u0F46\u0F7C\u0F51\u0F0B\u0F58\u0F0D \u0F0D\n        \u0F60\u0F56\u0FB1\u0F74\u0F44\u0F0B\u0F54\u0F7C\u0F0B\u0F62\u0F7C\u0F0B\u0F63\u0F44\u0F66\u0F0B\u0F51\u0FB2\u0F72\u0F0B\u0F5F\u0F0B\u0F62\u0FA3\u0F58\u0F66\u0F0B\u0F51\u0F44\u0F0B\u0F0D \u0F0D\n        \u0F42\u0F53\u0F7C\u0F51\u0F0B\u0F66\u0FA6\u0FB1\u0F72\u0F53\u0F0B\u0F5A\u0F7C\u0F42\u0F66\u0F0B\u0F40\u0FB1\u0F72\u0F66\u0F0B\u0F58\u0F51\u0F74\u0F53\u0F0B\u0F53\u0F66\u0F0B\u0F56\u0F66\u0F9F\u0F7C\u0F51\u0F0B\u0F58\u0F0D \u0F0D\n        \u0F55\u0FB1\u0F42\u0F0B\u0F60\u0F5A\u0F63\u0F0B\u0F4F\u0FB2\u0F4A\u0F0B\u0F45\u0F7A\u0F66\u0F0B\u0F56\u0FB1\u0F0B\u0F51\u0F44\u0F0B\u0F55\u0F4A\u0F0B\u0F40\u0FB1\u0F72\u0F66\u0F0D \u0F0D\n        \u0F55\u0F0B\u0F62\u0F7C\u0F63\u0F0B\u0F60\u0F41\u0FB2\u0F74\u0F63\u0F0B\u0F60\u0F41\u0F7C\u0F62\u0F0B\u0F62\u0F56\u0F0B\u0F4F\u0F74\u0F0B\u0F60\u0F47\u0F7C\u0F58\u0F66\u0F0B\u0F58\u0F0D \u0F0D\n        \u0F42\u0F61\u0F66\u0F0B\u0F56\u0F66\u0F90\u0F74\u0F58\u0F0B\u0F42\u0F61\u0F7C\u0F53\u0F0B\u0F56\u0F62\u0F90\u0FB1\u0F44\u0F0B\u0F5E\u0F56\u0F66\u0F0B\u0F40\u0FB1\u0F72\u0F66\u0F0B\u0F58\u0F53\u0F53\u0F0B\u0F4F\u0F7A\u0F0D \u0F0D\n        \u0F58\u0F7A\u0F0B\u0F60\u0F56\u0F62\u0F0B\u0F60\u0F41\u0FB2\u0F74\u0F42\u0F0B\u0F54\u0F0B\u0F64\u0F72\u0F53\u0F0B\u0F4F\u0F74\u0F0B\u0F60\u0F56\u0F62\u0F0B\u0F58\u0F0D \u0F0D\n        \u0F55\u0FB1\u0F42\u0F0B\u0F60\u0F5A\u0F63\u0F0B\u0F4F\u0F74\u0F0B\u0F62\u0F7A\u0F0B\u0F60\u0F47\u0F72\u0F42\u0F66\u0F0B\u0F54\u0F0B\u0F46\u0F7A\u0F53\u0F0B\u0F54\u0F7C\u0F66\u0F0D \u0F0D\n        \u0F56\u0F51\u0F74\u0F51\u0F0B\u0F40\u0FB1\u0F72\u0F0B\u0F51\u0F54\u0F60\u0F0B\u0F56\u0F7C\u0F0B\u0F62\u0FA3\u0F58\u0F0B\u0F54\u0F62\u0F0B\u0F60\u0F47\u0F7C\u0F58\u0F66\u0F0B\u0F58\u0F0D \u0F0D\n        \u0F46\u0F74\u0F0B\u0F66\u0F90\u0FB1\u0F7A\u0F66\u0F0B\u0F5E\u0F63\u0F0B\u0F53\u0F72\u0F0B\u0F41\u0FB2\u0F7C\u0F0B\u0F42\u0F49\u0F7A\u0F62\u0F0B\u0F63\u0FA1\u0F53\u0F0B\u0F58\u0F5B\u0F51\u0F0D \u0F0D\n        \u0F51\u0F42\u0FB2\u0F0B\u0F56\u0F7C\u0F0B\u0F50\u0F58\u0F66\u0F0B\u0F45\u0F51\u0F0B\u0F58\u0F0B\u0F63\u0F74\u0F66\u0F0B\u0F42\u0F66\u0F7C\u0F51\u0F0B\u0F58\u0F0D \u0F0D\n        \u0F55\u0FB1\u0F42\u0F0B\u0F60\u0F5A\u0F63\u0F0B\u0F51\u0F40\u0F7C\u0F53\u0F0B\u0F58\u0F46\u0F7C\u0F42\u0F0B\u0F42\u0F66\u0F74\u0F58\u0F0B\u0F58\u0F5A\u0F7C\u0F53\u0F0B\u0F55\u0FB1\u0F42\u0F0B\u0F62\u0F92\u0FB1\u0F60\u0F72\u0F0D \u0F0D\n        \u0F66\u0F7C\u0F62\u0F0B\u0F58\u0F7C\u0F66\u0F0B\u0F50\u0F74\u0F42\u0F66\u0F0B\u0F40\u0F62\u0F0B\u0F62\u0FA3\u0F58\u0F0B\u0F54\u0F62\u0F0B\u0F56\u0F62\u0F92\u0FB1\u0F53\u0F0B\u0F58\u0F0D \u0F0D\n        \u0F58\u0F0B\u0F63\u0F74\u0F66\u0F0B\u0F55\u0FB1\u0F7C\u0F42\u0F66\u0F0B\u0F40\u0FB1\u0F72\u0F0B\u0F60\u0F41\u0F7C\u0F62\u0F0B\u0F63\u0F7C\u0F66\u0F0B\u0F56\u0F62\u0F92\u0FB1\u0F53\u0F0B\u0F54\u0F60\u0F72\u0F0D \u0F0D\n        \u0F62\u0F44\u0F0B\u0F42\u0F72\u0F0B\u0F60\u0F7C\u0F51\u0F0B\u0F40\u0FB1\u0F72\u0F0B\u0F5A\u0F7C\u0F42\u0F66\u0F0B\u0F62\u0FA3\u0F58\u0F66\u0F0B\u0F60\u0F41\u0FB2\u0F74\u0F42\u0F0B\u0F58\u0F0D \u0F0D\n        \u0F55\u0FB1\u0F42\u0F0B\u0F60\u0F5A\u0F63\u0F0B\u0F62\u0F56\u0F0B\u0F4F\u0F74\u0F0B\u0F51\u0F42\u0F60\u0F0B\u0F56\u0F0B\u0F56\u0F62\u0F97\u0F72\u0F51\u0F0B\u0F54\u0F60\u0F72\u0F0D \u0F0D\n        \u0F51\u0F56\u0F74\u0F0B\u0F62\u0F92\u0FB1\u0F53\u0F0B\u0F60\u0F7C\u0F51\u0F0B\u0F40\u0FB1\u0F72\u0F0B\u0F55\u0FB2\u0F7A\u0F44\u0F0B\u0F56\u0F0B\u0F66\u0FA4\u0F7A\u0F63\u0F0B\u0F58\u0F0D \u0F0D\n      ".replace(/ /g, '').trim()
    },
    watch: {
      transliteration: function transliteration(value) {
        Storage.set('compareTransliteration', value);
      },
      tibetan: function tibetan(value) {
        Storage.set('compareTibetan', value);
      }
    },
    computed: {
      lines: function lines() {
        return this.tibetan ? this.tibetan.split("\n") : [];
      }
    },
    methods: {
      correctSource: function correctSource(result) {
        var lines = this.transliteration.split("\n");
        lines[result.lineIndex] = result.updatedLine;
        this.transliteration = lines.join("\n");
      }
    },
    template: "\n      <div class=\"ui container compare\">\n        <language-menu v-model=\"selectedLanguage\"></language-menu>\n        <div id=\"scrollable-area-container\">\n          <div id=\"scrollable-area\">\n            <tibetan-input v-model=\"tibetan\"></tibetan-input>\n            <transliteration-input\n              v-model=\"transliteration\"\n              v-on:paste=\"transliteration = $event\"></transliteration-input>\n            <transliterated-lines\n              v-bind:lines=\"lines\"\n              v-bind:expectedTransliteration=\"transliteration\"\n              v-bind:language=\"selectedLanguage\"\n              v-on:click-part=\"correctSource($event)\"\n            ></transliterated-lines>\n          </div>\n        </div>\n      </div>\n    "
  });
});