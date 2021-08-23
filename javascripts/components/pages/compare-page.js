var ComparePage = Vue.component('compare-page', {
  mixins: [initializeFieldsMixin],
  data() {
    return {
      loading: false,
      loadedFields: [],
      numberOfFieldsToLoad: 4,
      selectedRulesetId: Rulesets.defaultRulesetId,
      options: { capitalize: true },
      transliteration: '',
      tibetan: ''
    }
  },
  watch: {
    selectedRulesetId (value) {
      Storage.set('selectedRulesetId', value);
    },
    options: {
      deep: true,
      handler (value) {
        Storage.set('options', value);
      }
    },
    transliteration (value) {
      Storage.set('compareTransliteration', value);
    },
    tibetan (value) {
      Storage.set('compareTibetan', value);
    }
  },
  computed: {
    lines: function() {
      return this.tibetan ? this.tibetan.split("\n") : [];
    }
  },
  methods: {
    correctSource: function(result) {
      var lines = this.transliteration.split("\n");
      lines[result.lineIndex] = result.updatedLine;
      this.transliteration = lines.join("\n");
    }
  },
  created () {
    this.initializeField('selectedRulesetId', Rulesets.defaultRulesetId);
    this.initializeField('options', { capitalize: true });
    this.initializeField('transliteration', `
      Chatsal gyachin mélha tsangpa
      Lung lha natsok wangchuk chöma
      Jungpo rolang triza namtang
      Nöjin tsokyi düné töma
      Chatsal trat’ché chatang phet’kyi
      Paröl trülkhor raptu jomma
      Yekum yönkyang shapkyi nenté
      Mébar trukpa shintu barma
      Chatsal turé jikpa chénpö
      Dükyi pawo nampar jomma
      Chukyé shalni tro nyér dendzé
      Drawo tamché malü söma
      Chatsal könchok sumtsön chakgyé
      Sormö tukar nampar gyenma
      Malü chokyi khorlö gyenpé
      Rangki ökyi tsoknam trukma
    `.replace(/^[ ]*/gm, '').trim(), 'compareTransliteration');
    this.initializeField('tibetan', `
      ཕྱག་འཚལ་བརྒྱ་བྱིན་མེ་ལྷ་ཚངས་པ། །
      རླུང་ལྷ་སྣ་ཚོགས་དབང་ཕྱུག་མཆོད་མ། །
      འབྱུང་པོ་རོ་ལངས་དྲི་ཟ་རྣམས་དང་། །
      གནོད་སྦྱིན་ཚོགས་ཀྱིས་མདུན་ནས་བསྟོད་མ། །
      ཕྱག་འཚལ་ཏྲཊ་ཅེས་བྱ་དང་ཕཊ་ཀྱིས། །
      ཕ་རོལ་འཁྲུལ་འཁོར་རབ་ཏུ་འཇོམས་མ། །
      གཡས་བསྐུམ་གཡོན་བརྐྱང་ཞབས་ཀྱིས་མནན་ཏེ། །
      མེ་འབར་འཁྲུག་པ་ཤིན་ཏུ་འབར་མ། །
      ཕྱག་འཚལ་ཏུ་རེ་འཇིགས་པ་ཆེན་པོས། །
      བདུད་ཀྱི་དཔའ་བོ་རྣམ་པར་འཇོམས་མ། །
      ཆུ་སྐྱེས་ཞལ་ནི་ཁྲོ་གཉེར་ལྡན་མཛད། །
      དགྲ་བོ་ཐམས་ཅད་མ་ལུས་གསོད་མ། །
      ཕྱག་འཚལ་དཀོན་མཆོག་གསུམ་མཚོན་ཕྱག་རྒྱའི། །
      སོར་མོས་ཐུགས་ཀར་རྣམ་པར་བརྒྱན་མ། །
      མ་ལུས་ཕྱོགས་ཀྱི་འཁོར་ལོས་བརྒྱན་པའི། །
      རང་གི་འོད་ཀྱི་ཚོགས་རྣམས་འཁྲུག་མ། །
    `.replace(/ /g, '').trim(), 'compareTibetan');
  },
  mounted () {
    $('#tibetan, #transliteration').autosize();
  },
  updated () {
    this.$nextTick(() => {
      setTimeout(() => {
        $(window).resize();
        var fields = ['#tibetan', '#transliteration'];
        var highest = fields.max(function(element) { return $(element).height() || 0 });
        var others = fields.exclude(highest);
        var height = $(highest).css('height');
        _(others).each(function(element) {
          $(element).css('height', height)
        })
      }, 0);
    });
  },
  template: `
    <transition name="fade" appear>

      <div v-if="!loading" class="ui container compare">

        <div id="menu">
          <ruleset-dropdown v-model="selectedRulesetId" />
          <slider-checkbox
            v-model="options.capitalize"
            text="Capital letter at the beginning of each group"
          />
        </div>

        <div class="scrollable-area-container">

          <div class="scrollable-area">

            <tibetan-input v-model="tibetan" />

            <transliteration-input v-model="transliteration" />

            <compared-lines
              :lines="lines"
              :expectedTransliteration="transliteration"
              :rulesetId="selectedRulesetId"
              :options="options"
              @click-part="correctSource($event)"
            />

          </div>

        </div>

      </div>

    </transition>
  `
})

Vue.component('transliteration-input', {
  props: ['value'],
  template: `
    <div class="ui form" style="position: relative;">
      <div v-if="!value" id="tibetan-placeholder">
        Input the transliteration here...
      </div>
      <textarea
        :value="value"
        @input="$emit('input', $event.target.value)"
        spellcheck="false"
        id="transliteration"
      ></textarea>
    </div>
  `
});

Vue.component('compared-lines', {
  props: {
    expectedTransliteration: String,
    rulesetId: String,
    lines: Array,
    options: Object
  },
  methods: {
    emitClickPart: function(result) {
      this.$emit('click-part', result);
    }
  },
  computed: {
    expectedLines: function() {
      return this.expectedTransliteration .split("\n");
    },
    transliteratedLines: function() {
      var ruleset = Rulesets.find(this.rulesetId);
      var numberOfLines = Math.max(this.lines.length, this.expectedLines.length);
      return _(numberOfLines).times((index) => {
        var tibetan = this.lines[index] || '';
        var transliterated = new TibetanTransliterator({
          ruleset: ruleset,
          capitalize: this.options.capitalize
        }).transliterate(tibetan)
        return {
          expected: this.expectedLines[index],
          actual: transliterated
        }
      });
    },
  },
  template: `
    <div id="transliterated" class="result">
      <compare-diff
        class="line"
        v-for="(line, index) in transliteratedLines"
        :key="index"
        :lineIndex="index"
        :expected="line.expected"
        :actual="line.actual"
        @click-part="emitClickPart($event)"
      ></compare-diff>
    </div>
  `
})

Vue.component('compare-diff', {
  props: {
    lineIndex: Number,
    expected: String,
    actual: String
  },
  computed: {
    parts: function() {
      return JsDiff.diffChars(this.expected, this.actual);
    }
  },
  methods: {
    emitClickPart: function(clickedPart, clickedPartIndex) {
      var parts = this.parts;
      var updatedLine = '';
      _(parts).each(function(part, index) {
        if (clickedPart == parts[index-1] && part.added) updatedLine += part.value;
        else if (clickedPart == part && part.added) updatedLine += part.value;
        else {
          if (part.removed && !(clickedPart == part) && !(clickedPart == parts[index+1] && parts[index+1].added)) updatedLine += part.value;
          if (!part.removed && !part.added) updatedLine += part.value;
        }
      });
      this.$emit('click-part', {
        lineIndex: this.lineIndex,
        updatedLine: updatedLine
      });
    }
  },
  template: `
    <div>
      <span
        v-for="(part, partIndex) in parts"
        @click="(part.added || part.removed) && emitClickPart(part, partIndex)"
        :style="[part.added ? {color: '#2185d0', 'font-weight': 'bold'} : '', part.removed ? {color: '#db2828', 'font-weight': 'bold'} : '']"
        >{{part.added || part.removed ? part.value && part.value.replace(/ /g, '_') : part.value}}</span>
    </div>
  `
})