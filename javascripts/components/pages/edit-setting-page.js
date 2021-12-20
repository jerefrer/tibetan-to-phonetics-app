let redirectIfInvalidSettingIdOrTab = function (to, next) {
  if (Settings.find(to.params.settingId))
    if (_(['rules', 'exceptions']).includes(to.params.tab))
      next()
    else
      next ('/settings/' + to.params.settingId + '/rules')
  else
    next('/settings');
}

var EditSettingPage = Vue.component('edit-setting-page', {
  data () {
    return {
      name: undefined,
      rules: {},
      exceptions: [],
      showLivePreview: false,
      showActiveRulesOnly: false,
      showActiveExceptionsOnly: false,
      exceptionsAddedJustNow: {},
    }
  },
  beforeRouteEnter (to, from, next) {
    redirectIfInvalidSettingIdOrTab(to, next);
  },
  beforeRouteUpdate (to, from, next) {
    redirectIfInvalidSettingIdOrTab(to, next);
  },
  watch: {
    name(value) {
      this.updateSetting();
    },
    rules: {
      deep: true,
      handler (value) {
        this.updateSetting();
      }
    },
    exceptions: {
      deep: true,
      handler (value) {
        this.updateSetting();
      }
    }
  },
  computed: {
    currentTab () {
      return this.$route.params.tab;
    },
    setting () {
      return Settings.find(this.$route.params.settingId);
    },
    activeExceptions () {
      if (this.showActiveExceptionsOnly)
        return _(this.exceptions).filter((exception) =>
          this.$store.state.exceptionsUsedForThisText[exception.key] ||
          this.exceptionsAddedJustNow[exception.key]
        )
      else
        return this.exceptions;
    },
    exceptionsAsObject () {
      return _(this.exceptions).inject((hash, exception) => {
        if (exception.key.trim() && exception.value.trim())
          hash[exception.key] = exception.value;
        return hash;
      }, {});
    },
    fakeSettingForLivePreview () {
      return {
        rules: this.rules,
        exceptions: this.exceptionsAsObject
      }
    },
    groups () {
      return _({

        'Vowels': [
          ['a', 'a',  'ཨ'],
          ['drengbu', 'é',  'ཨེ'],
          ['i', 'i',  'ཨི'],
          ['o', 'o',  'ཨོ'],
          ['u', 'u',  'ཨུ'],
          ['ü', 'ü',  'ཨུད'],
          ['ö', 'ö',  'ཨོད'],
          ['aKikuI', "a'i",  '<span>པ</span>འི'],
          ['drengbuMaNaRa', 'e',  'མཁྱེན་', 'drengbu and suffix ma, na, ra', true],
          ['drengbuGaBaLaNga', 'e', 'འཕྲེང་', 'drengbu and suffix ga, ba, la, nga', true],
          ['aNa', 'e',  'རྒྱན་', 'no vowel and suffix na', true],
          ['aLa', 'e',  'རྒྱལ་', 'no vowel and suffix la', true],
        ],

        'Regular consonants': [
          ['ka', 'k',  'ཀ'],
          ['kha', 'kh', 'ཁ'],
          ['ga', 'k',  'ག'],
          ['nga', 'ng', 'ང'],
          ['ca', 'ch', 'ཅ'],
          ['cha', "ch'",'ཆ'],
          ['ja', "ch'",'ཇ'],
          ['nya', 'ny', 'ཉ'],
          ['ta', 't',  'ཏ'],
          ['tha', 'th', 'ཐ'],
          ['da', 't',  'ད'],
          ['na', 'n',  'ན'],
          ['pa', 'p',  'པ'],
          ['pha', "p'", 'ཕ'],
          ['ba', "p'", 'བ'],
          ['ma', 'm',  'མ'],
          ['tsa', 'ts', 'ཙ'],
          ['tsha', "ts'",'ཚ'],
          ['dza', 'dz', 'ཛ'],
          ['wa', 'w',  'ཝ'],
          ['zha', 'zh', 'ཞ'],
          ['za', 's',  'ཟ'],
          ['ya', 'y',  'ཡ'],
          ['ra', 'r',  'ར'],
          ['la', 'l',  'ལ'],
          ['sha', 'sh', 'ཤ'],
          ['sa', 's',  'ས'],
          ['ha', 'h',  'ཧ'],
        ],

        'Modified consonants (with prefix or superscribed)': [
          ['gaMod', 'g',  'རྒ'],
          ['jaMod', 'j',  'རྗ'],
          ['daMod', 'd',  'རྡ'],
          ['baMod', 'b',  'རྦ'],
          ['zaMod', 'z',  'བཟ'],
        ],

        'Ratas': [
          ['rata1', 'tr', 'ཏྲ', '1st column with rata'],
          ['rata2', "tr'",'ཁྲ', '2nd column with rata'],
          ['rata3', 'tr', 'བྲ', '3rd column with rata'],
          ['rata3Mod', 'dr', 'སྒྲ', '3rd column with rata and prefix or superscribed'],
          ['hra', 'hr', 'ཧྲ'],
        ],

        'Yatas': [
          ['kaYata', 'ky', 'ཀྱ'],
          ['khaYata', 'khy', 'ཁྱ'],
          ['gaYata', 'ky', 'གྱ'],
          ['gaModYata', 'gy', 'སྒྱ', 'ga with yata and prefix or superscribed'],
          ['paYata', 'ch', 'པྱ'],
          ['phaYata', "ch'", 'ཕྱ'],
          ['baYata', "ch'", 'བྱ'],
          ['baModYata', 'j', 'སྦྱ', 'ba with yata and prefix or superscribed'],
          ['daoWaYata', 'y', 'དབྱ'],
        ],

        'Latas': [
          ['lata', 'l', 'གླ'],
          ['lataDa', 'd', 'ཟླ'],
        ],

        'Special cases': [
          ['lha', 'lh', 'ལྷ'],
        ],

        'Suffixes': [
          ['kaSuffix', 'k', '<span>ད</span>ག'],
          ['ngaSuffix', 'ng', '<span>ད</span>ང'],
          ['naSuffix', 'n', '<span>ད</span>ན'],
          ['baSuffix', 'p', '<span>ད</span>བ'],
          ['maSuffix', 'm', '<span>ད</span>མ'],
          ['raSuffix', 'r', '<span>ད</span>ར'],
          ['laSuffix', 'l', '<span>ད</span>ལ'],
        ],

        'Formatting': [
          ['endLinkChar', '-',  'པེའུ', "separator, as in be-u or pa-o"],
        ],

      }).inject((hash, groupRules, groupName) => {
        hash[groupName] = groupRules.map((array) => {
          if (
            !this.showActiveRulesOnly ||
            this.$store.state.rulesUsedForThisText[array[0]]
          )
            return {
              key: array[0],
              value: array[1],
              example: array[2],
              comment: array[3],
              large: !!array[4]
            }
        }).compact();
        return hash;
      }, {})
    }
  },
  methods: {
    transliterated (text) {
      return new TibetanTransliterator(this.setting).transliterate(text);
    },
    updateSetting() {
      Settings.update(
        this.$route.params.settingId,
        this.name,
        this.rules,
        this.exceptionsAsObject
      );
    },
    addNewException () {
      this.exceptions.push({
        key: '',
        value: ''
      })
      this.markExceptionAsActive('');
    },
    markExceptionAsActive (key) {
      this.exceptionsAddedJustNow[key] = true;
    },
    revertExceptionsToOriginal () {
      if (confirm('Are you sure?')) {
        var defaultSetting = defaultSettings.findWhere({id: this.setting.id})
        Setting.updateExceptions(this.setting.id, defaultSetting.exceptions);
        this.exceptions = this.setting.exceptions;
      }
    }
  },
  mounted () {
    this.name = this.setting.name;
    this.rules = this.setting.rules;
    this.exceptions = _(this.setting.exceptions).map(function(value, key) {
      return { key: key, value: value }
    });
  },
  template: `
    <div
      class="ui container edit-setting with-live-preview"
      :class="{'with-live-preview-active': showLivePreview}"
    >

      <back-button />

      <div class="ui header">
        <div class="ui fluid input">
          <input v-model="name" :readonly="!setting.isEditable" />
        </div>
      </div>

      <div class="ui huge secondary pointing menu tab-menu">
        <tab-link tabId="rules">Rules</tab-link>
        <tab-link
          v-if="setting.isEditable || exceptions.length"
          tabId="exceptions"
        >
          Exceptions
        </tab-link>
      </div>

      <div v-if="currentTab == 'rules'" class="ui active tab">

        <div class="ui equal width grid">
          <es-group :groups="groups" :rules="rules" name="Regular consonants" />
          <es-group :groups="groups" :rules="rules" name="Vowels" />
        </div>

        <es-group :groups="groups" :rules="rules" class="ten wide"
          name="Modified consonants (with prefix or superscribed)" />

        <div class="ui equal width grid">
          <es-group :groups="groups" :rules="rules" name="Ratas" />
          <es-group :groups="groups" :rules="rules" name="Yatas" />
          <es-group :groups="groups" :rules="rules" name="Latas" />
        </div>

        <es-group :groups="groups" :rules="rules" name="Suffixes" />

        <div class="ui grid">
          <es-group class="four wide column" :groups="groups" :rules="rules" name="Special cases" />
          <es-group class="six wide column"  :groups="groups" :rules="rules" name="Formatting" />
          <options-group
            v-if="!showActiveRulesOnly || $store.state.rulesUsedForThisText['doubleS']"
            class="six wide column"
            :rules="rules"
          />
        </div>

      </div>

      <div v-if="currentTab == 'exceptions'" class="ui text container active tab">

        <div ref="div" class="ui large secondary center aligned segment">
          <p>
            These are the exceptions specific to this rule set, which will be
            applied on top of the general ones.
          </p>
          <p>
            This means that if you define an exception here that has the same
            left-hand value as one of the general exceptions, then the
            exception defined here will be used and the general exception
            will be ignored.
          </p>
        </div>

        <exceptions-instructions />

        <div class="exceptions">
          <div
            v-for="(exception, index) in activeExceptions"
            class="ui exception input"
          >
            <input
              class="tibetan"
              spellcheck="false"
              v-model="exception.key"
              :readonly="!setting.isEditable"
              @input="markExceptionAsActive(exception.key)"
            />
            <input
              class="tibetan"
              spellcheck="false"
              v-model="exception.value"
              :readonly="!setting.isEditable"
              @input="markExceptionAsActive(exception.key)"
            />
          </div>
          <div
            v-if="setting.isEditable"
            class="ui button new exception"
            :class="{
              'bottom': !setting.isDefault || !setting.isEditable,
              'attached': exceptions.length
            }"
            @click="addNewException"
          >
            <i class="plus icon" />
            Add a new exception
          </div>
        </div>

        <div
          v-if="setting.isDefault && setting.isEditable"
          class="ui bottom attached button reset-exceptions"
          @click="revertExceptionsToOriginal"
        >
          <i class="undo icon" />
          Reset all to default (all modifications will be lost)
        </div>

      </div>

      <div
        class="live-preview"
        :class="{active: showLivePreview}"
      >

        <button
          class="ui top attached icon button"
          @click="showLivePreview=!showLivePreview"
        >
          <i class="up arrow icon" />
          Live preview
        </button>

        <div id="menu" style="margin-bottom: 0">

          <slider-checkbox
            v-if="currentTab == 'rules'"
            v-model="showActiveRulesOnly"
            text="Show only the rules used in transliterating your text below"
          />

          <slider-checkbox
            v-if="currentTab == 'exceptions'"
            v-model="showActiveExceptionsOnly"
            text="Show only the exceptions used in transliterating your text below or those being worked on"
          />

        </div>

        <convert-boxes
          :setting="fakeSettingForLivePreview"
          tibetanStorageKey="live-preview"
        />

      </div>

    </div>
  `
})

Vue.component('es-group', {
  props: {
    name: String,
    groups: Object,
    rules: Object
  },
  computed: {
    groupRules () {
      return this.groups[this.name];
    },
    isEditable () {
      return Settings.find(this.$route.params.settingId).isEditable;
    }
  },
  methods: {
    isDifferentFromDefault (rule) {
      return defaultRules[rule.key] != this.rules[rule.key];
    },
    revert (rule) {
      this.rules[rule.key] = defaultRules[rule.key];
    }
  },
  template: `
    <div
      v-if="groupRules.length"
      class="column group"
      :class="{consonants: name == 'Regular consonants'}"
    >

      <div class="ui small header">
        {{name}}
      </div>

      <div
        v-for="rule in groupRules"
        class="ui labeled input rule"
        :class="{
          'right labeled': rule.comment,
          'different': isDifferentFromDefault(rule)
        }"
      >

        <div
          class="ui tibetan label"
          :class="{large: rule.large}"
        >
          <div v-html="rule.example"></div>
          <div
            v-if="isDifferentFromDefault(rule) && isEditable"
            class="ui icon blue button revert"
            :class="{'with-comment': rule.comment, 'large-label': rule.large}"
            @click="revert(rule)"
          >
            <i class="undo icon" />
          </div>
        </div>

        <input
          v-model="rules[rule.key]"
          spellcheck="false"
          :readonly="!isEditable"
        />

        <div class="ui label" v-if="rule.comment">
          <span>
            {{rule.comment}}
          </span>
        </div>

      </div>

    </div>
  `
})

Vue.component('options-group', {
  props: {
    name: String,
    groups: Object,
    rules: Object
  },
  computed: {
    isEditable () {
      return Settings.find(this.$route.params.settingId).isEditable;
    }
  },
  methods: {
    isBooleanDifferentFromDefault (key) {
      return !!defaultRules[key] != !!this.rules[key];
    }
  },
  template: `
    <div class="column group">

      <div class="ui small header">
        Options
      </div>

      <div
        class="ui labeled input rule right labeled"
        :class="{ 'different': isBooleanDifferentFromDefault('doubleS') }"
      >

        <div class="ui auto label">
          Double S
        </div>

        <slider-checkbox v-model="rules['doubleS']" :readonly="!isEditable" />

        <div class="ui label">
          <span>
            Have the "s" letter doubled between vowels (i.e. in "sossor" or "tsassum")
          </span>
        </div>

      </div>

    </div>
  `
})