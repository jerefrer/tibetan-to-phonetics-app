Vue.component('convert-boxes', {
  props: {
    language: Object,
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
  methods: {
    updateBoxesHeight() {
      // setTimeout(function() {
      //   $('#transliteration').css('height', $('textarea.tibetan').css('height'));
      // }, 0)
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
          :lines="lines"
          :language="language"
          :options="options"
        />
      </div>
    </div>
  `
})

Vue.component('transliterated-lines', {
  props: {
    language: Object,
    options: Object,
    lines: Array
  },
  computed: {
    transliteratedLines: function() {
      return this.lines.map((line) => {
        return new TibetanTransliterator(line, this.language, this.options)
          .transliterate();
      }).join("\n");
    },
  },
  template: `
    <div class="result">{{transliteratedLines}}</div>
  `
})