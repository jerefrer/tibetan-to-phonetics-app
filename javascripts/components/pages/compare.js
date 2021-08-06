var ComparePage = Vue.component('compare-page', {
  data() {
    return {
      selectedLanguage: TibetanTransliteratorSettings.language,
      transliteration: Storage.get('compareTransliteration') || `
        Lüpa mépar gukpar nüma
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
        Chatsal raptu gawa jipé
        U-gyen ökyi tréngwa pélma
      `.replace(/^[ ]*/gm, '').trim(),
      tibetan: Storage.get('compareTibetan') || `
        ལུས་པ་མེད་པར་འགུགས་པར་ནུས་མ། །
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
        ཕྱག་འཚལ་རབ་ཏུ་དགའ་བ་བརྗིད་པའི། །
        དབུ་རྒྱན་འོད་ཀྱི་ཕྲེང་བ་སྤེལ་མ། །
      `.replace(/ /g, '').trim()
    }
  },
  watch: {
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
  template: `
    <div class="ui container compare">
      <language-menu v-model="selectedLanguage"></language-menu>
      <div id="scrollable-area-container">
        <div id="scrollable-area">
          <tibetan-input
            v-model="tibetan"
            :allFields="['#tibetan', '#transliteration', '#transliterated']"
          ></tibetan-input>
          <transliteration-input
            v-model="transliteration"
            v-on:paste="transliteration = $event"></transliteration-input>
          <compared-lines
            v-bind:lines="lines"
            v-bind:expectedTransliteration="transliteration"
            v-bind:language="selectedLanguage"
            v-on:click-part="correctSource($event)"
          ></compared-lines>
        </div>
      </div>
    </div>
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
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
        spellcheck="false"
        id="transliteration"
      ></textarea>
    </div>
  `,
  mounted: function() {
    var that = this;
    $('#transliteration').autosize();
    $('#transliteration').on('paste', function(event) {
      event.preventDefault();
      var pastedData = event.originalEvent.clipboardData.getData('text/plain');
      that.$emit('paste', extractTransliteration(pastedData));
      setTimeout(function() {
        updateHeight(['#tibetan', '#transliteration', '#transliterated']);
      }, 100)
    });
  }
});

Vue.component('compared-lines', {
  props: {
    expectedTransliteration: String,
    language: String,
    lines: Array
  },
  methods: {
    expectedLines: function() {
      return this.expectedTransliteration.split("\n");
    },
    emitClickPart: function(result) {
      this.$emit('click-part', result);
    }
  },
  computed: {
    transliteratedLines: function() {
      var that = this;
      TibetanTransliteratorSettings.change(this.language);
      return this.lines.map(function(line, index) {
        return {
          expected: that.expectedLines()[index],
          actual: new TibetanTransliterator(line).transliterate().capitalize()
        }
      });
    },
  },
  template: `
    <div id="transliterated">
      <compare-diff
        class="line"
        v-for="(line, index) in transliteratedLines"
        v-bind:key="index"
        v-bind:lineIndex="index"
        v-bind:expected="line.expected"
        v-bind:actual="line.actual"
        v-on:click-part="emitClickPart($event)"
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
        v-on:click="(part.added || part.removed) && emitClickPart(part, partIndex)"
        v-bind:style="[part.added ? {color: '#2185d0', 'font-weight': 'bold'} : '', part.removed ? {color: '#db2828', 'font-weight': 'bold'} : '']"
        >{{part.added || part.removed ? part.value && part.value.replace(/ /, '_') : part.value}}</span>
    </div>
  `
})