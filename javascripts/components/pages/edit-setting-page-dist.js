"use strict";

var redirectIfInvalidSettingIdOrTab = function redirectIfInvalidSettingIdOrTab(to, next) {
  if (Settings.find(to.params.settingId)) {
    if (_(['rules', 'exceptions']).includes(to.params.tab)) next();else next('/settings/' + to.params.settingId + '/rules');
  } else next('/settings');
};

var EditSettingPage = Vue.component('edit-setting-page', {
  data: function data() {
    return {
      name: undefined,
      rules: {},
      exceptions: [],
      showLivePreview: false,
      showActiveRulesOnly: false,
      showActiveExceptionsOnly: false,
      exceptionsAddedJustNow: {}
    };
  },
  beforeRouteEnter: function beforeRouteEnter(to, from, next) {
    redirectIfInvalidSettingIdOrTab(to, next);
  },
  beforeRouteUpdate: function beforeRouteUpdate(to, from, next) {
    redirectIfInvalidSettingIdOrTab(to, next);
  },
  watch: {
    name: function name(value) {
      this.updateSetting();
    },
    rules: {
      deep: true,
      handler: function handler(value) {
        this.updateSetting();
      }
    },
    exceptions: {
      deep: true,
      handler: function handler(value) {
        this.updateSetting();
      }
    }
  },
  computed: {
    currentTab: function currentTab() {
      return this.$route.params.tab;
    },
    setting: function setting() {
      return Settings.find(this.$route.params.settingId);
    },
    activeExceptions: function activeExceptions() {
      var _this = this;

      if (this.showActiveExceptionsOnly) return _(this.exceptions).filter(function (exception) {
        return _this.$store.state.exceptionsUsedForThisText[exception.key] || _this.exceptionsAddedJustNow[exception.key];
      });else return this.exceptions;
    },
    exceptionsAsObject: function exceptionsAsObject() {
      return _(this.exceptions).inject(function (hash, exception) {
        if (exception.key.trim() && exception.value.trim()) hash[exception.key] = exception.value;
        return hash;
      }, {});
    },
    normalizedExceptionsAsObject: function normalizedExceptionsAsObject() {
      return normalizeExceptions(this.exceptionsAsObject);
    },
    fakeSettingForLivePreview: function fakeSettingForLivePreview() {
      return {
        rules: this.rules,
        exceptions: this.normalizedExceptionsAsObject
      };
    },
    groups: function groups() {
      var _this2 = this;

      return _({
        'Vowels': [['a', 'ཨ'], ['drengbu', 'ཨེ'], ['i', 'ཨི'], ['o', 'ཨོ'], ['u', 'ཨུ'], ['ü', 'ཨུད'], ['ö', 'ཨོད'], ['aKikuI', '<span>པ</span>འི'], ['drengbuMaNaRa', 'མཁྱེན་', 'drengbu and suffix ma, na, ra', true], ['drengbuGaBaLaNga', 'འཕྲེང་', 'drengbu and suffix ga, ba, la, nga', true], ['aNa', 'རྒྱན་', 'no vowel and suffix na', true], ['aLa', 'རྒྱལ་', 'no vowel and suffix la', true]],
        'Regular consonants': [['ka', 'ཀ'], ['kha', 'ཁ'], ['ga', 'ག'], ['nga', 'ང'], ['ca', 'ཅ'], ['cha', 'ཆ'], ['ja', 'ཇ'], ['nya', 'ཉ'], ['ta', 'ཏ'], ['tha', 'ཐ'], ['da', 'ད'], ['na', 'ན'], ['pa', 'པ'], ['pha', 'ཕ'], ['ba', 'བ'], ['ma', 'མ'], ['tsa', 'ཙ'], ['tsha', 'ཚ'], ['dza', 'ཛ'], ['wa', 'ཝ'], ['zha', 'ཞ'], ['za', 'ཟ'], ['ya', 'ཡ'], ['ra', 'ར'], ['la', 'ལ'], ['sha', 'ཤ'], ['sa', 'ས'], ['ha', 'ཧ']],
        'Modified consonants (with prefix or superscribed)': [['gaMod', 'རྒ'], ['jaMod', 'རྗ'], ['daMod', 'རྡ'], ['baMod', 'རྦ'], ['zaMod', 'འཟ']],
        'Ratas': [['rata1', 'ཏྲ', '1st column with rata'], ['rata2', 'ཁྲ', '2nd column with rata'], ['rata3', 'བྲ', '3rd column with rata'], ['rata3Mod', 'སྒྲ', '3rd column with rata and prefix or superscribed'], ['hra', 'ཧྲ']],
        'Yatas': [['kaYata', 'ཀྱ'], ['khaYata', 'ཁྱ'], ['gaYata', 'གྱ'], ['gaModYata', 'སྒྱ', 'ga with yata and prefix or superscribed'], ['paYata', 'པྱ'], ['phaYata', 'ཕྱ'], ['baYata', 'བྱ'], ['baModYata', 'སྦྱ', 'ba with yata and prefix or superscribed'], ['daoWaYata', 'དབྱ']],
        'Latas': [['lata', 'གླ'], ['lataDa', 'ཟླ']],
        'Special cases': [['lha', 'ལྷ']],
        'Suffixes': [['kaSuffix', '<span>ད</span>ག'], ['ngaSuffix', '<span>ད</span>ང'], ['naSuffix', '<span>ད</span>ན'], ['baSuffix', '<span>ད</span>བ'], ['maSuffix', '<span>ད</span>མ'], ['raSuffix', '<span>ད</span>ར'], ['laSuffix', '<span>ད</span>ལ']],
        'Formatting': [['endEqualsStart', 'གཞོན་ནུ', "link between identical consonants", true, {
          dash: 'Dash (zhön-nu)',
          space: 'Space (zhön nu)',
          merge: 'Merge (zhönu)',
          leave: 'Do nothing (zhönnu)'
        }], ['endLinkChar', 'པེའུ', "separator, as in be-u or pa-o"]]
      }).inject(function (hash, groupRules, groupName) {
        hash[groupName] = groupRules.map(function (array) {
          if (!_this2.showActiveRulesOnly || _this2.$store.state.rulesUsedForThisText[array[0]]) return {
            key: array[0],
            example: array[1],
            comment: array[2],
            large: !!array[3],
            selectOptions: array[4] && _(array[4]).map(function (value, key) {
              return {
                id: key,
                name: value
              };
            })
          };
        }).compact();
        return hash;
      }, {});
    }
  },
  methods: {
    transliterated: function transliterated(text) {
      return new TibetanTransliterator(this.setting).transliterate(text);
    },
    updateSetting: function updateSetting() {
      Settings.update(this.$route.params.settingId, this.name, this.rules, this.normalizedExceptionsAsObject);
    },
    addNewException: function addNewException() {
      this.exceptions.push({
        key: '',
        value: ''
      });
      this.markExceptionAsActive('');
    },
    markExceptionAsActive: function markExceptionAsActive(key) {
      this.exceptionsAddedJustNow[key] = true;
    },
    revertExceptionsToOriginal: function revertExceptionsToOriginal() {
      if (confirm('Are you sure?')) {
        var defaultSetting = defaultSettings.findWhere({
          id: this.setting.id
        });
        Setting.updateExceptions(this.setting.id, defaultSetting.exceptions);
        this.exceptions = this.setting.exceptions;
      }
    },
    exceptionsArrayFromObject: function exceptionsArrayFromObject(object) {
      return _(object).map(function (value, key) {
        return {
          key: key,
          value: value
        };
      });
    }
  },
  mounted: function mounted() {
    this.name = this.setting.name;
    this.rules = this.setting.rules;
    this.exceptions = this.exceptionsArrayFromObject(this.setting.exceptions);
  },
  template: "\n    <div\n      class=\"ui container edit-setting with-live-preview\"\n      :class=\"{'with-live-preview-active': showLivePreview}\"\n    >\n\n      <back-button />\n\n      <div class=\"ui header\">\n        <div class=\"ui fluid input\">\n          <input v-model=\"name\" :readonly=\"!setting.isEditable\" />\n        </div>\n      </div>\n\n      <div class=\"ui huge secondary pointing menu tab-menu\">\n        <tab-link tabId=\"rules\">Rules</tab-link>\n        <tab-link\n          v-if=\"setting.isEditable || exceptions.length\"\n          tabId=\"exceptions\"\n        >\n          Exceptions\n        </tab-link>\n      </div>\n\n      <div v-if=\"currentTab == 'rules'\" class=\"ui active tab\">\n\n        <div class=\"ui equal width grid\">\n          <es-group :groups=\"groups\" :rules=\"rules\" name=\"Regular consonants\" />\n          <es-group :groups=\"groups\" :rules=\"rules\" name=\"Vowels\" />\n        </div>\n\n        <es-group :groups=\"groups\" :rules=\"rules\" class=\"ten wide\"\n          name=\"Modified consonants (with prefix or superscribed)\" />\n\n        <div class=\"ui equal width grid\">\n          <es-group :groups=\"groups\" :rules=\"rules\" name=\"Ratas\" />\n          <es-group :groups=\"groups\" :rules=\"rules\" name=\"Yatas\" />\n          <es-group :groups=\"groups\" :rules=\"rules\" name=\"Latas\" />\n        </div>\n\n        <es-group :groups=\"groups\" :rules=\"rules\" name=\"Suffixes\" />\n\n        <div class=\"ui grid\">\n          <es-group class=\"four wide column\" :groups=\"groups\" :rules=\"rules\" name=\"Special cases\" />\n          <es-group class=\"six wide column\"  :groups=\"groups\" :rules=\"rules\" name=\"Formatting\" />\n          <options-group\n            v-if=\"!showActiveRulesOnly || $store.state.rulesUsedForThisText['doubleS']\"\n            class=\"six wide column\"\n            :rules=\"rules\"\n          />\n        </div>\n\n      </div>\n\n      <div v-if=\"currentTab == 'exceptions'\" class=\"ui text container active tab\">\n\n        <div ref=\"div\" class=\"ui large secondary center aligned segment\">\n          <p>\n            These are the exceptions specific to this rule set, which will be\n            applied on top of the general ones.\n          </p>\n          <p>\n            This means that if you define an exception here that has the same\n            left-hand value as one of the general exceptions, then the\n            exception defined here will be used and the general exception\n            will be ignored.\n          </p>\n        </div>\n\n        <exceptions-instructions />\n\n        <div class=\"exceptions\">\n          <div\n            v-for=\"(exception, index) in activeExceptions\"\n            class=\"ui exception input\"\n          >\n            <input\n              class=\"tibetan\"\n              spellcheck=\"false\"\n              v-model=\"exception.key\"\n              :readonly=\"!setting.isEditable\"\n              @input=\"markExceptionAsActive(exception.key)\"\n            />\n            <input\n              class=\"tibetan\"\n              spellcheck=\"false\"\n              v-model=\"exception.value\"\n              :readonly=\"!setting.isEditable\"\n              @input=\"markExceptionAsActive(exception.key)\"\n            />\n          </div>\n          <div\n            v-if=\"setting.isEditable\"\n            class=\"ui button new exception\"\n            :class=\"{\n              'bottom': !setting.isDefault || !setting.isEditable,\n              'attached': exceptions.length\n            }\"\n            @click=\"addNewException\"\n          >\n            <i class=\"plus icon\" />\n            Add a new exception\n          </div>\n        </div>\n\n        <div\n          v-if=\"setting.isDefault && setting.isEditable\"\n          class=\"ui bottom attached button reset-exceptions\"\n          @click=\"revertExceptionsToOriginal\"\n        >\n          <i class=\"undo icon\" />\n          Reset all to default (all modifications will be lost)\n        </div>\n\n      </div>\n\n      <div\n        class=\"live-preview\"\n        :class=\"{active: showLivePreview}\"\n      >\n\n        <button\n          class=\"ui top attached icon button\"\n          @click=\"showLivePreview=!showLivePreview\"\n        >\n          <i class=\"up arrow icon\" />\n          Live preview\n        </button>\n\n        <div id=\"menu\" style=\"margin-bottom: 0\">\n\n          <slider-checkbox\n            v-if=\"currentTab == 'rules'\"\n            v-model=\"showActiveRulesOnly\"\n            text=\"Show only above the rules used in transliterating your text below\"\n          />\n\n          <slider-checkbox\n            v-if=\"currentTab == 'exceptions'\"\n            v-model=\"showActiveExceptionsOnly\"\n            text=\"Show only above the exceptions used in transliterating your text below and those that have just been added\"\n          />\n\n        </div>\n\n        <convert-boxes\n          :setting=\"fakeSettingForLivePreview\"\n          tibetanStorageKey=\"live-preview\"\n        />\n\n      </div>\n\n    </div>\n  "
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
      return Settings.find(this.$route.params.settingId).isEditable;
    }
  },
  methods: {
    isDifferentFromDefault: function isDifferentFromDefault(rule) {
      return defaultRules[rule.key] != this.rules[rule.key];
    },
    revert: function revert(rule) {
      this.rules[rule.key] = defaultRules[rule.key];
    }
  },
  template: "\n    <div\n      v-if=\"groupRules.length\"\n      class=\"column group\"\n      :class=\"{consonants: name == 'Regular consonants'}\"\n    >\n\n      <div class=\"ui small header\">\n        {{name}}\n      </div>\n\n      <div\n        v-for=\"rule in groupRules\"\n        class=\"ui labeled input rule\"\n        :class=\"{\n          'right labeled': rule.comment,\n          'different': isDifferentFromDefault(rule)\n        }\"\n      >\n\n        <div\n          class=\"ui tibetan label\"\n          :class=\"{large: rule.large}\"\n        >\n          <div v-html=\"rule.example\"></div>\n          <div\n            v-if=\"isDifferentFromDefault(rule) && isEditable\"\n            class=\"ui icon blue button revert\"\n            :class=\"{'with-comment': rule.comment, 'large-label': rule.large}\"\n            @click=\"revert(rule)\"\n          >\n            <i class=\"undo icon\" />\n          </div>\n        </div>\n\n        <rule-dropdown\n          v-if=\"rule.selectOptions\"\n          v-model=\"rules[rule.key]\"\n          :options=\"rule.selectOptions\"\n          :isEditable=\"isEditable\"\n          :isDifferent=\"isDifferentFromDefault(rule)\"\n          @click:revert=\"revert(rule)\"\n        />\n\n        <input\n          v-else\n          v-model=\"rules[rule.key]\"\n          spellcheck=\"false\"\n          :readonly=\"!isEditable\"\n        />\n\n        <div class=\"ui label\" v-if=\"rule.comment\">\n          <span v-html=\"rule.comment\" />\n        </div>\n\n      </div>\n\n    </div>\n  "
});
Vue.component('options-group', {
  props: {
    name: String,
    groups: Object,
    rules: Object
  },
  computed: {
    isEditable: function isEditable() {
      return Settings.find(this.$route.params.settingId).isEditable;
    }
  },
  methods: {
    isBooleanDifferentFromDefault: function isBooleanDifferentFromDefault(key) {
      return !!defaultRules[key] != !!this.rules[key];
    }
  },
  template: "\n    <div class=\"column group\">\n\n      <div class=\"ui small header\">\n        Options\n      </div>\n\n      <div\n        class=\"ui labeled input rule right labeled\"\n        :class=\"{ 'different': isBooleanDifferentFromDefault('doubleS') }\"\n      >\n\n        <div class=\"ui auto label\">\n          Double S\n        </div>\n\n        <slider-checkbox v-model=\"rules['doubleS']\" :readonly=\"!isEditable\" />\n\n        <div class=\"ui label\">\n          <span>\n            have the \"s\" letter doubled between vowels (i.e. in \"sossor\" or \"tsassum\")\n          </span>\n        </div>\n\n      </div>\n\n    </div>\n  "
});
Vue.component('rule-dropdown', {
  model: {
    prop: 'value'
  },
  props: {
    value: String,
    options: Array,
    isEditable: Boolean,
    isDifferent: Boolean
  },
  watch: {
    value: function value(_value) {
      $(this.$refs.dropdownDiv).dropdown('set selected', _value);
    }
  },
  mounted: function mounted() {
    var _this3 = this;

    $(this.$refs.dropdownDiv).dropdown({
      values: _(this.options).map(function (option) {
        return {
          value: option.id,
          html: option.name,
          name: option.name,
          selected: _this3.value == option.id
        };
      }),
      onChange: function onChange() {
        setTimeout(function () {
          var value = $(_this3.$refs.dropdownDiv).dropdown('get value');

          _this3.$emit('input', value);
        }, 0);
      }
    });
  },
  template: "\n    <div\n      class=\"ui normal selection dropdown\"\n      ref=\"dropdownDiv\"\n      :class=\"{ disabled: !isEditable }\"\n    >\n      <input type=\"hidden\" />\n      <i class=\"dropdown icon\"></i>\n      <div class=\"text\"></div>\n      <div class=\"menu\">\n      </div>\n      <div\n        v-if=\"isDifferent && isEditable\"\n        class=\"ui icon blue button revert\"\n        @click.stop=\"$emit('click:revert')\"\n      >\n        <i class=\"undo icon\" />\n      </div>\n    </div>\n  "
});