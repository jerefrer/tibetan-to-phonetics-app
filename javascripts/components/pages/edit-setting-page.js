let redirectIfInvalidRulesetIdOrTab = function (to, next) {
  if (Rulesets.find(to.params.rulesetId))
    if (_(['rules', 'exceptions']).includes(to.params.tab))
      next()
    else
      next ('/settings/' + to.params.rulesetId + '/rules')
  else
    next('/settings');
}

var EditSettingPage = Vue.component('edit-setting-page', {
  data () {
    return {
      name: undefined,
      rules: {},
      exceptions: [],
      showLivePreview: false
    }
  },
  beforeRouteEnter (to, from, next) {
    redirectIfInvalidRulesetIdOrTab(to, next);
  },
  beforeRouteUpdate (to, from, next) {
    redirectIfInvalidRulesetIdOrTab(to, next);
  },
  watch: {
    name(value) {
      this.updateRuleset();
    },
    rules: {
      deep: true,
      handler (value) {
        this.updateRuleset();
      }
    },
    exceptions: {
      deep: true,
      handler (value) {
        this.updateRuleset();
      }
    }
  },
  computed: {
    currentTab () {
      return this.$route.params.tab;
    },
    ruleset () {
      return Rulesets.find(this.$route.params.rulesetId);
    },
    exceptionsAsObject () {
      return _(this.exceptions).inject((hash, exception) => {
        if (exception.key.trim() && exception.value.trim())
          hash[exception.key] = exception.value;
        return hash;
      }, {});
    },
    fakeRulesetForLivePreview () {
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
          ['aKikuI', "a'i",  'པའི'],
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
          ['kaSuffix', 'k', 'དག'],
          ['ngaSuffix', 'ng', 'དང'],
          ['naSuffix', 'n', 'དན'],
          ['baSuffix', 'p', 'དབ'],
          ['maSuffix', 'm', 'དམ'],
          ['raSuffix', 'r', 'དར'],
          ['laSuffix', 'l', 'དལ'],
        ],

        'Formatting': [
          ['endLinkChar', '-',  'པེའོ', "separator, as in be'u or pa'o"],
        ],

      }).inject((hash, groupRules, groupName) => {
        hash[groupName] = groupRules.map((array) => {
          return {
            key: array[0],
            value: array[1],
            example: array[2],
            comment: array[3],
            large: !!array[4]
          }
        }, {})
        return hash;
      }, {})
    }
  },
  methods: {
    transliterated (text) {
      return new TibetanTransliterator(this.ruleset).transliterate(text);
    },
    updateRuleset() {
      Rulesets.update(
        this.$route.params.rulesetId,
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
    },
    revertExceptionsToOriginal () {
      if (confirm('Are you sure?')) {
        var defaultRuleset = defaultRulesets.findWhere({id: this.ruleset.id})
        Ruleset.updateExceptions(this.ruleset.id, defaultRuleset.exceptions);
        this.exceptions = this.ruleset.exceptions;
      }
    }
  },
  mounted () {
    this.name = this.ruleset.name;
    this.rules = this.ruleset.rules;
    this.exceptions = _(this.ruleset.exceptions).map(function(value, key) {
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
          <input v-model="name" :readonly="!ruleset.isEditable" />
        </div>
      </div>

      <div class="ui huge secondary pointing menu tab-menu">
        <tab-link tabId="rules">Rules</tab-link>
        <tab-link
          v-if="ruleset.isEditable || exceptions.length"
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
          <options-group class="six wide column" :rules="rules" />
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
            v-for="(exception, index) in exceptions"
            class="ui exception input"
          >
            <input
              class="tibetan"
              spellcheck="false"
              v-model="exception.key"
              :readonly="!ruleset.isEditable"
            />
            <input
              class="tibetan"
              spellcheck="false"
              v-model="exception.value"
              :readonly="!ruleset.isEditable"
            />
          </div>
          <div
            v-if="ruleset.isEditable"
            class="ui button new exception"
            :class="{
              'bottom': !ruleset.isDefault || !ruleset.isEditable,
              'attached': exceptions.length
            }"
            @click="addNewException"
          >
            <i class="plus icon" />
            Add a new exception
          </div>
        </div>

        <div
          v-if="ruleset.isDefault && ruleset.isEditable"
          class="ui bottom attached button reset-exceptions"
          @click="revertExceptionsToOriginal"
        >
          <i class="undo icon" />
          Reset all to default (all modifications will be lost)
        </div>

      </div>

      <div
        v-if="ruleset.isEditable"
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
        <convert-boxes
          :ruleset="fakeRulesetForLivePreview"
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
      return Rulesets.find(this.$route.params.rulesetId).isEditable;
    }
  },
  methods: {
    isDifferentFromDefault (rule) {
      return originalRules[rule.key] != this.rules[rule.key];
    },
    revert (rule) {
      this.rules[rule.key] = originalRules[rule.key];
    }
  },
  template: `
    <div
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
          {{rule.example}}
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
      return Rulesets.find(this.$route.params.rulesetId).isEditable;
    }
  },
  methods: {
    isBooleanDifferentFromDefault (key) {
      return !!originalRules[key] != !!this.rules[key];
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
            Have the "s" letter doubled, for instance in "zhelssé" or "lamssel"
          </span>
        </div>

      </div>

    </div>
  `
})