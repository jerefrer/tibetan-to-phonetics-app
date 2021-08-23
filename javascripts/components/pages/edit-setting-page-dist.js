"use strict";

var redirectIfInvalidRulesetIdOrTab = function redirectIfInvalidRulesetIdOrTab(to, next) {
  if (Rulesets.find(to.params.rulesetId)) {
    if (_(['rules', 'exceptions']).includes(to.params.tab)) next();else next('/settings/' + to.params.rulesetId + '/rules');
  } else next('/settings');
};

var EditSettingPage = Vue.component('edit-setting-page', {
  data: function data() {
    return {
      name: undefined,
      rules: {},
      exceptions: [],
      showLivePreview: false
    };
  },
  beforeRouteEnter: function beforeRouteEnter(to, from, next) {
    redirectIfInvalidRulesetIdOrTab(to, next);
  },
  beforeRouteUpdate: function beforeRouteUpdate(to, from, next) {
    redirectIfInvalidRulesetIdOrTab(to, next);
  },
  watch: {
    name: function name(value) {
      this.updateRuleset();
    },
    rules: {
      deep: true,
      handler: function handler(value) {
        this.updateRuleset();
      }
    },
    exceptions: {
      deep: true,
      handler: function handler(value) {
        this.updateRuleset();
      }
    }
  },
  computed: {
    currentTab: function currentTab() {
      return this.$route.params.tab;
    },
    ruleset: function ruleset() {
      return Rulesets.find(this.$route.params.rulesetId);
    },
    exceptionsAsObject: function exceptionsAsObject() {
      return _(this.exceptions).inject(function (hash, exception) {
        if (exception.key.trim() && exception.value.trim()) hash[exception.key] = exception.value;
        return hash;
      }, {});
    },
    fakeRulesetForLivePreview: function fakeRulesetForLivePreview() {
      return {
        rules: this.rules,
        exceptions: this.exceptionsAsObject
      };
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
      return new TibetanTransliterator(this.ruleset).transliterate(text);
    },
    updateRuleset: function updateRuleset() {
      Rulesets.update(this.$route.params.rulesetId, this.name, this.rules, this.exceptionsAsObject);
    },
    addNewException: function addNewException() {
      this.exceptions.push({
        key: '',
        value: ''
      });
    },
    revertExceptionsToOriginal: function revertExceptionsToOriginal() {
      if (confirm('Are you sure?')) {
        var defaultRuleset = defaultRulesets.findWhere({
          id: this.ruleset.id
        });
        Ruleset.updateExceptions(this.ruleset.id, defaultRuleset.exceptions);
        this.exceptions = this.ruleset.exceptions;
      }
    }
  },
  mounted: function mounted() {
    this.name = this.ruleset.name;
    this.rules = this.ruleset.rules;
    this.exceptions = _(this.ruleset.exceptions).map(function (value, key) {
      return {
        key: key,
        value: value
      };
    });
  },
  template: "\n    <div\n      class=\"ui container edit-setting with-live-preview\"\n      :class=\"{'with-live-preview-active': showLivePreview}\"\n    >\n\n      <back-button />\n\n      <div class=\"ui header\">\n        <div class=\"ui fluid input\">\n          <input v-model=\"name\" :readonly=\"!ruleset.isEditable\" />\n        </div>\n      </div>\n\n      <div class=\"ui huge secondary pointing menu tab-menu\">\n        <tab-link tabId=\"rules\">Rules</tab-link>\n        <tab-link\n          v-if=\"ruleset.isEditable || exceptions.length\"\n          tabId=\"exceptions\"\n        >\n          Exceptions\n        </tab-link>\n      </div>\n\n      <div v-if=\"currentTab == 'rules'\" class=\"ui active tab\">\n\n        <div class=\"ui equal width grid\">\n          <es-group :groups=\"groups\" :rules=\"rules\" name=\"Regular consonants\" />\n          <es-group :groups=\"groups\" :rules=\"rules\" name=\"Vowels\" />\n        </div>\n\n        <es-group :groups=\"groups\" :rules=\"rules\" class=\"ten wide\"\n          name=\"Modified consonants (with prefix or superscribed)\" />\n\n        <div class=\"ui equal width grid\">\n          <es-group :groups=\"groups\" :rules=\"rules\" name=\"Ratas\" />\n          <es-group :groups=\"groups\" :rules=\"rules\" name=\"Yatas\" />\n          <es-group :groups=\"groups\" :rules=\"rules\" name=\"Latas\" />\n        </div>\n\n        <es-group :groups=\"groups\" :rules=\"rules\" name=\"Suffixes\" />\n\n        <div class=\"ui equal width grid\">\n          <es-group :groups=\"groups\" :rules=\"rules\" name=\"Special cases\" />\n          <es-group :groups=\"groups\" :rules=\"rules\" name=\"Formatting\" />\n          <div class=\"column\"></div>\n        </div>\n\n      </div>\n\n      <div v-if=\"currentTab == 'exceptions'\" class=\"ui text container active tab\">\n\n        <div ref=\"div\" class=\"ui large secondary center aligned segment\">\n          <p>\n            These are the exceptions specific to this rule set, which will be\n            applied on top of the general ones.\n          </p>\n          <p>\n            This means that if you define an exception here that has the same\n            left-hand value as one of the general exceptions, then the\n            exception defined here will be used and the general exception\n            will be ignored.\n          </p>\n        </div>\n\n        <exceptions-instructions />\n\n        <div class=\"exceptions\">\n          <div\n            v-for=\"(exception, index) in exceptions\"\n            class=\"ui exception input\"\n          >\n            <input\n              class=\"tibetan\"\n              spellcheck=\"false\"\n              v-model=\"exception.key\"\n              :readonly=\"!ruleset.isEditable\"\n            />\n            <input\n              class=\"tibetan\"\n              spellcheck=\"false\"\n              v-model=\"exception.value\"\n              :readonly=\"!ruleset.isEditable\"\n            />\n          </div>\n          <div\n            v-if=\"ruleset.isEditable\"\n            class=\"ui button new exception\"\n            :class=\"{\n              'bottom': !ruleset.isDefault || !ruleset.isEditable,\n              'attached': exceptions.length\n            }\"\n            @click=\"addNewException\"\n          >\n            <i class=\"plus icon\" />\n            Add a new exception\n          </div>\n        </div>\n\n        <div\n          v-if=\"ruleset.isDefault && ruleset.isEditable\"\n          class=\"ui bottom attached button reset-exceptions\"\n          @click=\"revertExceptionsToOriginal\"\n        >\n          <i class=\"undo icon\" />\n          Reset all to default (all modifications will be lost)\n        </div>\n\n      </div>\n\n      <div\n        v-if=\"ruleset.isEditable\"\n        class=\"live-preview\"\n        :class=\"{active: showLivePreview}\"\n      >\n        <button\n          class=\"ui top attached icon button\"\n          @click=\"showLivePreview=!showLivePreview\"\n        >\n          <i class=\"up arrow icon\" />\n          Live preview\n        </button>\n        <convert-boxes\n          :ruleset=\"fakeRulesetForLivePreview\"\n          tibetanStorageKey=\"live-preview\"\n        />\n      </div>\n\n    </div>\n  "
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
      return Rulesets.find(this.$route.params.rulesetId).isEditable;
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