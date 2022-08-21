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
    processedLines () {
      rulesUsedForThisText = {};
      exceptionsUsedForThisText = {};
      var processedLines = this.lines.map((line) => {
        var tibetanGroupsRegExp =
          /([†◌卍卐\u{f00}-\u{fda}\u{f021}-\u{f042}\u{f162}-\u{f588}])+/giu;
        var tibetanParts = line.match(tibetanGroupsRegExp);
        if (tibetanParts) {
          var lineWithTibetanReplaced = line;
          tibetanParts.each((tibetanPart) => {
            var transliterated = new TibetanTransliterator({
              setting: this.setting,
              capitalize: this.options.capitalize
            }).transliterate(tibetanPart);
            lineWithTibetanReplaced = lineWithTibetanReplaced.replace(tibetanPart, transliterated)
          })
          return {
            type: 'tibetan',
            source: line,
            text: lineWithTibetanReplaced
          };
        } else
          return {
            type: 'translation',
            text: line
          }
      });
      this.$store.commit('updateRulesUsedForThisText', rulesUsedForThisText);
      this.$store.commit('updateExceptionsUsedForThisText', exceptionsUsedForThisText);
      return processedLines;
    },
    processedLinesAsString () {
      return this.processedLines.map('text').join("\n").trim();
    },
    isAlternated () {
      return !!this.processedLines.find({type: 'translation'})
    }
  },
  template: `
    <div class="result">
      <template v-if="isAlternated || options.includeTibetan">
        <template v-for="(line, index) in processedLines">
          <template v-if="line.type == 'tibetan'">
            <div
              v-if="options.includeTibetan"
              class="tibetan"
            >{{line.source}}</div>
            <div class="transliteration">{{line.text}}</div>
          </template>
          <div v-else class="translation">{{line.text}}</div>
        </template>
      </template>
      <template v-else>{{processedLinesAsString}}</template>
    </div>
  `
})