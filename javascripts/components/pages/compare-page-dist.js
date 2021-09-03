"use strict";

var ComparePage = Vue.component('compare-page', {
  mixins: [initializeFieldsMixin],
  data: function data() {
    return {
      loading: false,
      loadedFields: [],
      numberOfFieldsToLoad: 4,
      selectedSettingId: Settings.defaultSettingId,
      options: {
        capitalize: true
      },
      transliteration: '',
      tibetan: ''
    };
  },
  watch: {
    selectedSettingId: function selectedSettingId(value) {
      Storage.set('selectedSettingId', value);
    },
    options: {
      deep: true,
      handler: function handler(value) {
        Storage.set('options', value);
      }
    },
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
  created: function created() {
    this.initializeField('selectedSettingId', Settings.defaultSettingId);
    this.initializeField('options', {
      capitalize: true
    });
    this.initializeField('transliteration', "\n      Chatsal gyachin m\xE9lha tsangpa\n      Lung lha natsok wangchuk ch\xF6ma\n      Jungpo rolang triza namtang\n      N\xF6jin tsokyi d\xFCn\xE9 t\xF6ma\n      Chatsal trat\u2019ch\xE9 chatang phet\u2019kyi\n      Par\xF6l tr\xFClkhor raptu jomma\n      Yekum y\xF6nkyang shapkyi nent\xE9\n      M\xE9bar trukpa shintu barma\n      Chatsal tur\xE9 jikpa ch\xE9np\xF6\n      D\xFCkyi pawo nampar jomma\n      Chuky\xE9 shalni tro ny\xE9r dendz\xE9\n      Drawo tamch\xE9 mal\xFC s\xF6ma\n      Chatsal k\xF6nchok sumts\xF6n chakgy\xE9\n      Sorm\xF6 tukar nampar gyenma\n      Mal\xFC chokyi khorl\xF6 gyenp\xE9\n      Rangki \xF6kyi tsoknam trukma\n    ".replace(/^[ ]*/gm, '').trim(), 'compareTransliteration');
    this.initializeField('tibetan', "\n      \u0F55\u0FB1\u0F42\u0F0B\u0F60\u0F5A\u0F63\u0F0B\u0F56\u0F62\u0F92\u0FB1\u0F0B\u0F56\u0FB1\u0F72\u0F53\u0F0B\u0F58\u0F7A\u0F0B\u0F63\u0FB7\u0F0B\u0F5A\u0F44\u0F66\u0F0B\u0F54\u0F0D \u0F0D\n      \u0F62\u0FB3\u0F74\u0F44\u0F0B\u0F63\u0FB7\u0F0B\u0F66\u0FA3\u0F0B\u0F5A\u0F7C\u0F42\u0F66\u0F0B\u0F51\u0F56\u0F44\u0F0B\u0F55\u0FB1\u0F74\u0F42\u0F0B\u0F58\u0F46\u0F7C\u0F51\u0F0B\u0F58\u0F0D \u0F0D\n      \u0F60\u0F56\u0FB1\u0F74\u0F44\u0F0B\u0F54\u0F7C\u0F0B\u0F62\u0F7C\u0F0B\u0F63\u0F44\u0F66\u0F0B\u0F51\u0FB2\u0F72\u0F0B\u0F5F\u0F0B\u0F62\u0FA3\u0F58\u0F66\u0F0B\u0F51\u0F44\u0F0B\u0F0D \u0F0D\n      \u0F42\u0F53\u0F7C\u0F51\u0F0B\u0F66\u0FA6\u0FB1\u0F72\u0F53\u0F0B\u0F5A\u0F7C\u0F42\u0F66\u0F0B\u0F40\u0FB1\u0F72\u0F66\u0F0B\u0F58\u0F51\u0F74\u0F53\u0F0B\u0F53\u0F66\u0F0B\u0F56\u0F66\u0F9F\u0F7C\u0F51\u0F0B\u0F58\u0F0D \u0F0D\n      \u0F55\u0FB1\u0F42\u0F0B\u0F60\u0F5A\u0F63\u0F0B\u0F4F\u0FB2\u0F4A\u0F0B\u0F45\u0F7A\u0F66\u0F0B\u0F56\u0FB1\u0F0B\u0F51\u0F44\u0F0B\u0F55\u0F4A\u0F0B\u0F40\u0FB1\u0F72\u0F66\u0F0D \u0F0D\n      \u0F55\u0F0B\u0F62\u0F7C\u0F63\u0F0B\u0F60\u0F41\u0FB2\u0F74\u0F63\u0F0B\u0F60\u0F41\u0F7C\u0F62\u0F0B\u0F62\u0F56\u0F0B\u0F4F\u0F74\u0F0B\u0F60\u0F47\u0F7C\u0F58\u0F66\u0F0B\u0F58\u0F0D \u0F0D\n      \u0F42\u0F61\u0F66\u0F0B\u0F56\u0F66\u0F90\u0F74\u0F58\u0F0B\u0F42\u0F61\u0F7C\u0F53\u0F0B\u0F56\u0F62\u0F90\u0FB1\u0F44\u0F0B\u0F5E\u0F56\u0F66\u0F0B\u0F40\u0FB1\u0F72\u0F66\u0F0B\u0F58\u0F53\u0F53\u0F0B\u0F4F\u0F7A\u0F0D \u0F0D\n      \u0F58\u0F7A\u0F0B\u0F60\u0F56\u0F62\u0F0B\u0F60\u0F41\u0FB2\u0F74\u0F42\u0F0B\u0F54\u0F0B\u0F64\u0F72\u0F53\u0F0B\u0F4F\u0F74\u0F0B\u0F60\u0F56\u0F62\u0F0B\u0F58\u0F0D \u0F0D\n      \u0F55\u0FB1\u0F42\u0F0B\u0F60\u0F5A\u0F63\u0F0B\u0F4F\u0F74\u0F0B\u0F62\u0F7A\u0F0B\u0F60\u0F47\u0F72\u0F42\u0F66\u0F0B\u0F54\u0F0B\u0F46\u0F7A\u0F53\u0F0B\u0F54\u0F7C\u0F66\u0F0D \u0F0D\n      \u0F56\u0F51\u0F74\u0F51\u0F0B\u0F40\u0FB1\u0F72\u0F0B\u0F51\u0F54\u0F60\u0F0B\u0F56\u0F7C\u0F0B\u0F62\u0FA3\u0F58\u0F0B\u0F54\u0F62\u0F0B\u0F60\u0F47\u0F7C\u0F58\u0F66\u0F0B\u0F58\u0F0D \u0F0D\n      \u0F46\u0F74\u0F0B\u0F66\u0F90\u0FB1\u0F7A\u0F66\u0F0B\u0F5E\u0F63\u0F0B\u0F53\u0F72\u0F0B\u0F41\u0FB2\u0F7C\u0F0B\u0F42\u0F49\u0F7A\u0F62\u0F0B\u0F63\u0FA1\u0F53\u0F0B\u0F58\u0F5B\u0F51\u0F0D \u0F0D\n      \u0F51\u0F42\u0FB2\u0F0B\u0F56\u0F7C\u0F0B\u0F50\u0F58\u0F66\u0F0B\u0F45\u0F51\u0F0B\u0F58\u0F0B\u0F63\u0F74\u0F66\u0F0B\u0F42\u0F66\u0F7C\u0F51\u0F0B\u0F58\u0F0D \u0F0D\n      \u0F55\u0FB1\u0F42\u0F0B\u0F60\u0F5A\u0F63\u0F0B\u0F51\u0F40\u0F7C\u0F53\u0F0B\u0F58\u0F46\u0F7C\u0F42\u0F0B\u0F42\u0F66\u0F74\u0F58\u0F0B\u0F58\u0F5A\u0F7C\u0F53\u0F0B\u0F55\u0FB1\u0F42\u0F0B\u0F62\u0F92\u0FB1\u0F60\u0F72\u0F0D \u0F0D\n      \u0F66\u0F7C\u0F62\u0F0B\u0F58\u0F7C\u0F66\u0F0B\u0F50\u0F74\u0F42\u0F66\u0F0B\u0F40\u0F62\u0F0B\u0F62\u0FA3\u0F58\u0F0B\u0F54\u0F62\u0F0B\u0F56\u0F62\u0F92\u0FB1\u0F53\u0F0B\u0F58\u0F0D \u0F0D\n      \u0F58\u0F0B\u0F63\u0F74\u0F66\u0F0B\u0F55\u0FB1\u0F7C\u0F42\u0F66\u0F0B\u0F40\u0FB1\u0F72\u0F0B\u0F60\u0F41\u0F7C\u0F62\u0F0B\u0F63\u0F7C\u0F66\u0F0B\u0F56\u0F62\u0F92\u0FB1\u0F53\u0F0B\u0F54\u0F60\u0F72\u0F0D \u0F0D\n      \u0F62\u0F44\u0F0B\u0F42\u0F72\u0F0B\u0F60\u0F7C\u0F51\u0F0B\u0F40\u0FB1\u0F72\u0F0B\u0F5A\u0F7C\u0F42\u0F66\u0F0B\u0F62\u0FA3\u0F58\u0F66\u0F0B\u0F60\u0F41\u0FB2\u0F74\u0F42\u0F0B\u0F58\u0F0D \u0F0D\n    ".replace(/ /g, '').trim(), 'compareTibetan');
  },
  mounted: function mounted() {
    $('#tibetan, #transliteration').autosize();
  },
  updated: function updated() {
    this.$nextTick(function () {
      setTimeout(function () {
        $(window).resize();
        var fields = ['#tibetan', '#transliteration'];
        var highest = fields.max(function (element) {
          return $(element).height() || 0;
        });
        var others = fields.exclude(highest);
        var height = $(highest).css('height');

        _(others).each(function (element) {
          $(element).css('height', height);
        });
      }, 0);
    });
  },
  template: "\n    <transition name=\"fade\" appear>\n\n      <div v-if=\"!loading\" class=\"ui container compare\">\n\n        <div id=\"menu\">\n          <settings-dropdown v-model=\"selectedSettingId\" />\n          <slider-checkbox\n            v-model=\"options.capitalize\"\n            text=\"Capital letter at the beginning of each group\"\n          />\n        </div>\n\n        <div class=\"scrollable-area-container\">\n\n          <div class=\"scrollable-area\">\n\n            <tibetan-input v-model=\"tibetan\" />\n\n            <transliteration-input v-model=\"transliteration\" />\n\n            <compared-lines\n              :lines=\"lines\"\n              :expectedTransliteration=\"transliteration\"\n              :settingId=\"selectedSettingId\"\n              :options=\"options\"\n              @click-part=\"correctSource($event)\"\n            />\n\n          </div>\n\n        </div>\n\n      </div>\n\n    </transition>\n  "
});
Vue.component('transliteration-input', {
  props: ['value'],
  template: "\n    <div class=\"ui form\" style=\"position: relative;\">\n      <div v-if=\"!value\" id=\"tibetan-placeholder\">\n        Input the transliteration here...\n      </div>\n      <textarea\n        :value=\"value\"\n        @input=\"$emit('input', $event.target.value)\"\n        spellcheck=\"false\"\n        id=\"transliteration\"\n      ></textarea>\n    </div>\n  "
});
Vue.component('compared-lines', {
  props: {
    expectedTransliteration: String,
    settingId: String,
    lines: Array,
    options: Object
  },
  methods: {
    emitClickPart: function emitClickPart(result) {
      this.$emit('click-part', result);
    }
  },
  computed: {
    expectedLines: function expectedLines() {
      return this.expectedTransliteration.split("\n");
    },
    transliteratedLines: function transliteratedLines() {
      var _this = this;

      var setting = Settings.find(this.settingId);
      var numberOfLines = Math.max(this.lines.length, this.expectedLines.length);
      return _(numberOfLines).times(function (index) {
        var tibetan = _this.lines[index] || '';
        var transliterated = new TibetanTransliterator({
          setting: setting,
          capitalize: _this.options.capitalize
        }).transliterate(tibetan);
        return {
          expected: _this.expectedLines[index],
          actual: transliterated
        };
      });
    }
  },
  template: "\n    <div id=\"transliterated\" class=\"result\">\n      <compare-diff\n        class=\"line\"\n        v-for=\"(line, index) in transliteratedLines\"\n        :key=\"index\"\n        :lineIndex=\"index\"\n        :expected=\"line.expected\"\n        :actual=\"line.actual\"\n        @click-part=\"emitClickPart($event)\"\n      ></compare-diff>\n    </div>\n  "
});
Vue.component('compare-diff', {
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
  template: "\n    <div>\n      <span\n        v-for=\"(part, partIndex) in parts\"\n        @click=\"(part.added || part.removed) && emitClickPart(part, partIndex)\"\n        :style=\"[part.added ? {color: '#2185d0', 'font-weight': 'bold'} : '', part.removed ? {color: '#db2828', 'font-weight': 'bold'} : '']\"\n        >{{part.added || part.removed ? part.value && part.value.replace(/ /g, '_') : part.value}}</span>\n    </div>\n  "
});