var ConvertPage = Vue.component('convert-page', {
  data () {
    return {
      selectedLanguageId: Storage.get('selectedLanguageId') || Languages.defaultLanguageId,
      options: Storage.get('options') || { capitalize: true },
      tibetan: Storage.get('tibetan') || `
        ཧཱུྃ༔
        ཨོ་རྒྱན་ཡུལ་གྱི་ནུབ་བྱང་མཚམས༔
        པདྨ་གེ་སར་སྡོང་པོ་ལ༔
        ཡ་མཚན་མཆོག་གི་དངོས་གྲུབ་བཪྙེས༔
        པདྨ་འབྱུང་གནས་ཞེས་སུ་གྲགས༔
        འཁོར་དུ་མཁའ་འགྲོ་མང་པོས་བསྐོར༔
        ཁྱེད་ཀྱི་རྗེས་སུ་བདག་བསྒྲུབ་ཀྱིས༔
        བྱིན་གྱིས་བརླབ་ཕྱིར་གཤེགས་སུ་གསོལ༔
        གུ་རུ་པདྨ་སིདྡྷི་ཧཱུྃ༔
      `.replace(/ /g, '').trim()
    }
  },
  watch: {
    tibetan (value) {
      Storage.set('tibetan', value);
    },
    selectedLanguageId (value) {
      Storage.set('selectedLanguageId', value);
    }
  },
  computed: {
    lines: function() {
      return this.tibetan ? this.tibetan.split("\n") : [];
    }
  },
  methods: {
    updateBoxesHeight() {
      $('#tibetan').autosize();
      setTimeout(function() {
        $('#transliteration').css('height', $('textarea.tibetan').css('height'));
      }, 0)
    }
  },
  mounted () { this.updateBoxesHeight() },
  updated () { this.updateBoxesHeight() },
  template: `
    <div class="ui fluid container">
      <div id="menu">
        <language-menu v-model="selectedLanguageId" />
        <slider-checkbox
          v-model="options.capitalize"
          text="Capital letter at the beginning of each group"
        />
      </div>
      <div id="scrollable-area-container">
        <clipboard-button v-if="tibetan" />
        <div id="scrollable-area">
          <tibetan-input v-model="tibetan" />
          <transliterated-lines
            :lines="lines"
            :languageId="selectedLanguageId"
            :options="options"
          />
        </div>
      </div>
    </div>
  `
})

Vue.component('transliterated-lines', {
  props: {
    languageId: String,
    options: Object,
    lines: Array
  },
  computed: {
    transliteratedLines: function() {
      var language = Languages.find(this.languageId);
      return this.lines.map((line) => {
        return new TibetanTransliterator(line, language, this.options).transliterate();
      }).join("\n");
    },
  },
  template: `
    <div class="ui form">
      <textarea id="transliteration" readonly="">{{transliteratedLines}}</textarea>
    </div>
  `
})