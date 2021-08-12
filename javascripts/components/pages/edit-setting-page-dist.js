"use strict";

var EditSettingPage = Vue.component('edit-setting-page', {
  data: function data() {
    return {
      currentTab: 'rules',
      name: undefined,
      rules: {},
      exceptions: []
    };
  },
  watch: {
    name: function name(value) {
      this.updateLanguage();
    },
    rules: {
      deep: true,
      handler: function handler(value) {
        this.updateLanguage();
      }
    },
    exceptions: {
      deep: true,
      handler: function handler(value) {
        this.updateLanguage();
      }
    }
  },
  computed: {
    language: function language() {
      return Languages.find(this.$route.params.languageId);
    },
    groups: function groups() {
      return _({
        'Vowels': [['a', 'a', 'ཨ'], ['drengbu', 'é', 'ཨེ'], ['i', 'i', 'ཨི'], ['o', 'o', 'ཨོ'], ['u', 'u', 'ཨུ'], ['ü', 'ü', 'ཨུད'], ['ö', 'ö', 'ཨོད'], ['aKikuI', "a'i", 'པའི'], ['drengbuMaNaRa', 'e', 'མཁྱེན་', 'drengbu and suffix ma, na, ra', true], ['drengbuGaBaLaNga', 'e', 'འཕྲེང་', 'drengbu and suffix ga, ba, la, nga', true], ['aNa', 'e', 'རྒྱན་', 'no vowel and suffix na', true], ['aLa', 'e', 'རྒྱལ་', 'no vowel and suffix la', true]],
        'Regular consonants': [['ka', 'k', 'ཀ'], ['kha', 'kh', 'ཁ'], ['ga', 'k', 'ག'], ['nga', 'ng', 'ང'], ['ca', 'ch', 'ཅ'], ['cha', "ch'", 'ཆ'], ['ja', "ch'", 'ཇ'], ['nya', 'ny', 'ཉ'], ['ta', 't', 'ཏ'], ['tha', 'th', 'ཐ'], ['da', 't', 'ད'], ['na', 'n', 'ན'], ['pa', 'p', 'པ'], ['pha', "p'", 'ཕ'], ['ba', "p'", 'བ'], ['ma', 'm', 'མ'], ['tsa', 'ts', 'ཙ'], ['tsha', "ts'", 'ཚ'], ['dza', 'dz', 'ཛ'], ['wa', 'w', 'ཝ'], ['zha', 'zh', 'ཞ'], ['za', 's', 'ཟ'], ['ya', 'y', 'ཡ'], ['ra', 'r', 'ར'], ['la', 'l', 'ལ'], ['sha', 'sh', 'ཤ'], ['sa', 's', 'ས'], ['ha', 'h', 'ཧ']],
        'Modified consonants (with prefix or superscribed)': [['gaMod', 'g', 'རྒ'], ['jaMod', 'j', 'རྗ'], ['daMod', 'd', 'རྡ'], ['baMod', 'b', 'རྦ'], ['zaMod', 'z', 'བཟ']],
        'Ratas': [['rata1', 'tr', 'ཏྲ', '1st column with rata'], ['rata2', "tr'", 'ཁྲ', '2nd column with rata'], ['rata3', 'tr', 'བྲ', '3rd column with rata'], ['rata3Mod', 'dr', 'སྒྲ', '3rd column with rata and prefix or superscribed'], ['hra', 'hr', 'ཧྲ']],
        'Yatas': [['kaYata', 'ky', 'ཀྱ'], ['khaYata', 'khy', 'ཁྱ'], ['gaYata', 'ky', 'གྱ'], ['gaModYata', 'gy', 'སྒྱ', 'ga with yata and prefix or superscribed'], ['paYata', 'ch', 'པྱ'], ['phaYata', "ch'", 'ཕྱ'], ['baYata', "ch'", 'བྱ'], ['baModYata', 'j', 'སྦྱ', 'ba with yata and prefix or superscribed'], ['daoWaYata', 'y', 'དབྱ']],
        'Latas': [['lata', 'l', 'གླ'], ['lataDa', 'd', 'ཟླ']],
        'Special cases': [['lha', 'lh', 'ལྷ']],
        'Suffixes': [['kaSuffix', 'k', 'དག'], ['ngaSuffix', 'ng', 'དང'], ['naSuffix', 'n', 'དན'], ['baSuffix', 'p', 'དབ'], ['maSuffix', 'm', 'དམ'], ['raSuffix', 'r', 'དར'], ['laSuffix', 'l', 'དལ']],
        'Formatting': [['endLinkChar', '-', 'པེའོ', "separator, as in be'u or pa'o"]]
      }).inject(function (hash, groupRules, groupName) {
        hash[groupName] = groupRules.map(function (array) {
          return {
            key: array[0],
            value: array[1],
            example: array[2],
            comment: array[3],
            large: !!array[4]
          };
        }, {});
        return hash;
      }, {});
    }
  },
  methods: {
    transliterated: function transliterated(text) {
      return new TibetanTransliterator(text, this.language).transliterate();
    },
    updateLanguage: function updateLanguage() {
      var exceptionsAsObject = _(this.exceptions).inject(function (hash, exception) {
        if (exception.key.trim() && exception.value.trim()) hash[exception.key] = exception.value;
        return hash;
      }, {});

      Languages.update(this.$route.params.languageId, this.name, this.rules, exceptionsAsObject);
    },
    addNewException: function addNewException() {
      this.exceptions.push({
        key: '',
        value: ''
      });
    },
    revertExceptionsToOriginal: function revertExceptionsToOriginal() {
      if (confirm('Are you sure?')) {
        var defaultLanguage = defaultLanguages.findWhere({
          id: this.language.id
        });
        Language.updateExceptions(this.language.id, defaultLanguage.exceptions);
        this.exceptions = this.language.exceptions;
      }
    }
  },
  mounted: function mounted() {
    this.name = this.language.name;
    this.rules = this.language.rules;
    this.exceptions = _(this.language.exceptions).map(function (value, key) {
      return {
        key: key,
        value: value
      };
    });
  },
  template: "\n    <div class=\"ui container edit-setting\">\n\n      <div class=\"ui header\">\n        <div class=\"ui fluid input\">\n          <input v-model=\"name\" :readonly=\"!language.isEditable\" />\n        </div>\n      </div>\n\n      <div class=\"ui huge secondary pointing menu tab-menu\">\n        <tab-link v-model=\"currentTab\" tabId=\"rules\">Rules</tab-link>\n        <tab-link\n          v-if=\"language.isEditable || exceptions.length\"\n          v-model=\"currentTab\"\n          tabId=\"exceptions\"\n        >\n          Exceptions\n        </tab-link>\n      </div>\n\n      <div v-if=\"currentTab == 'rules'\" class=\"ui active tab\">\n\n        <div class=\"ui equal width grid\">\n          <es-group :groups=\"groups\" :rules=\"rules\" name=\"Regular consonants\" />\n          <es-group :groups=\"groups\" :rules=\"rules\" name=\"Vowels\" />\n        </div>\n\n        <es-group :groups=\"groups\" :rules=\"rules\" class=\"ten wide\"\n          name=\"Modified consonants (with prefix or superscribed)\" />\n\n        <div class=\"ui equal width grid\">\n          <es-group :groups=\"groups\" :rules=\"rules\" name=\"Ratas\" />\n          <es-group :groups=\"groups\" :rules=\"rules\" name=\"Yatas\" />\n          <es-group :groups=\"groups\" :rules=\"rules\" name=\"Latas\" />\n        </div>\n\n        <es-group :groups=\"groups\" :rules=\"rules\" name=\"Suffixes\" />\n\n        <div class=\"ui equal width grid\">\n          <es-group :groups=\"groups\" :rules=\"rules\" name=\"Special cases\" />\n          <es-group :groups=\"groups\" :rules=\"rules\" name=\"Formatting\" />\n          <div class=\"column\"></div>\n        </div>\n\n      </div>\n\n      <div v-if=\"currentTab == 'exceptions'\" class=\"ui active tab\">\n\n        <div class=\"exceptions\">\n          <div\n            v-for=\"(exception, index) in exceptions\"\n            class=\"ui exception input\"\n          >\n            <input\n              class=\"tibetan\"\n              spellcheck=\"false\"\n              v-model=\"exception.key\"\n              :readonly=\"!language.isEditable\"\n            />\n            <input\n              class=\"tibetan\"\n              spellcheck=\"false\"\n              v-model=\"exception.value\"\n              :readonly=\"!language.isEditable\"\n            />\n          </div>\n          <div\n            v-if=\"language.isEditable\"\n            class=\"new exception\"\n            @click=\"addNewException\"\n          >\n            <i class=\"plus icon\" />\n            Add a new exception\n          </div>\n        </div>\n\n        <div\n          v-if=\"language.isDefault && language.isEditable\"\n          class=\"ui bottom attached button reset-exceptions\"\n          @click=\"revertExceptionsToOriginal\"\n        >\n          <i class=\"undo icon\" />\n          Reset all to default (all modifications will be lost)\n        </div>\n\n      </div>\n\n    </div>\n  "
});
Vue.component('es-group', {
  props: {
    name: String,
    groups: Object,
    rules: Object
  },
  computed: {
    groupRules: function groupRules() {
      return this.groups[this.name];
    },
    isEditable: function isEditable() {
      return Languages.find(this.$route.params.languageId).isEditable;
    }
  },
  methods: {
    isDifferentFromDefault: function isDifferentFromDefault(rule) {
      return originalRules[rule.key] != this.rules[rule.key];
    },
    revert: function revert(rule) {
      this.rules[rule.key] = originalRules[rule.key];
    }
  },
  template: "\n    <div\n      class=\"column group\"\n      :class=\"{consonants: name == 'Regular consonants'}\"\n    >\n\n      <div class=\"ui small header\">\n        {{name}}\n      </div>\n\n      <div\n        v-for=\"rule in groupRules\"\n        class=\"ui labeled input rule\"\n        :class=\"{\n          'right labeled': rule.comment,\n          'different': isDifferentFromDefault(rule)\n        }\"\n      >\n\n        <div\n          class=\"ui tibetan label\"\n          :class=\"{large: rule.large}\"\n        >\n          {{rule.example}}\n          <div\n            v-if=\"isDifferentFromDefault(rule) && isEditable\"\n            class=\"ui icon blue button revert\"\n            @click=\"revert(rule)\"\n          >\n            <i class=\"undo icon\" />\n          </div>\n        </div>\n\n        <input\n          v-model=\"rules[rule.key]\"\n          spellcheck=\"false\"\n          :readonly=\"!isEditable\"\n        />\n\n        <div class=\"ui label\" v-if=\"rule.comment\">\n          <span>\n            {{rule.comment}}\n          </span>\n        </div>\n\n      </div>\n\n    </div>\n  "
});