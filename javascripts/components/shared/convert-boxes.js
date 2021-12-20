Vue.component('convert-boxes', {
  props: {
    setting: Object,
    tibetanStorageKey: String,
    options: {
      type: Object,
      default: () => { return {} }
    },
  },
  data () {
    return {
      tibetan: undefined,
    }
  },
  watch: {
    tibetan (value) {
      Storage.set(this.tibetanStorageKey, value);
    }
  },
  computed: {
    lines: function() {
      return this.tibetan ? this.tibetan.split("\n") : [];
    }
  },
  created () {
    Storage.get(this.tibetanStorageKey, `
      ཧཱུྃ༔
      ཨོ་རྒྱན་ཡུལ་གྱི་ནུབ་བྱང་མཚམས༔
      པདྨ་གེ་སར་སྡོང་པོ་ལ༔
      ཡ་མཚན་མཆོག་གི་དངོས་གྲུབ་བཪྙེས༔
      པདྨ་འབྱུང་གནས་ཞེས་སུ་གྲགས༔
      འཁོར་དུ་མཁའ་འགྲོ་མང་པོས་བསྐོར༔
      ཁྱེད་ཀྱི་རྗེས་སུ་བདག་བསྒྲུབ་ཀྱིས༔
      བྱིན་གྱིས་བརླབ་ཕྱིར་གཤེགས་སུ་གསོལ༔
      གུ་རུ་པདྨ་སིདྡྷི་ཧཱུྃ༔
    `.replace(/ /g, '').trim(), (value) => {
      this.tibetan = value;
    })
  },
  mounted () {
    $('#tibetan').autosize();
  },
  updated () {
    this.$nextTick(() => $(window).resize());
  },
  template: `
    <div class="scrollable-area-container">
      <clipboard-button v-if="tibetan" />
      <div class="scrollable-area">
        <tibetan-input v-model="tibetan" />
        <transliterated-lines
          class="clipboard-target"
          :lines="lines"
          :setting="setting"
          :options="options"
        />
      </div>
    </div>
  `
})

Vue.component('transliterated-lines', {
  props: {
    setting: Object,
    options: Object,
    lines: Array
  },
  computed: {
    transliteratedLines () {
      rulesUsedForThisText = {};
      exceptionsUsedForThisText = {};
      var transliteratedLines = this.lines.map((line) => {
        return new TibetanTransliterator({
          setting: this.setting,
          capitalize: this.options.capitalize
        }).transliterate(line);
      });
      this.$store.commit('updateRulesUsedForThisText', rulesUsedForThisText);
      this.$store.commit('updateExceptionsUsedForThisText', exceptionsUsedForThisText);
      return transliteratedLines;
    },
    transliteratedLinesAsString () {
      return this.transliteratedLines.join("\n").trim();
    }
  },
  template: `
    <div class="result">
      <template v-if="options.alternateTibetanAndTransliteration">
        <template v-for="(line, index) in lines">
          <div class="tibetan">{{line}}</div>
          <div class="transliteration">{{transliteratedLines[index]}}</div>
        </template>
      </template>
      <template v-else>{{transliteratedLinesAsString}}</template>
    </div>
  `
})