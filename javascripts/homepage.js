var Homepage = Vue.component('homepage', {
  data () {
    return {
      selectedLanguage: TibetanTransliteratorSettings.language,
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
    }
  },
  computed: {
    lines: function() {
      return this.tibetan ? this.tibetan.split("\n") : [];
    }
  },
  template: `
    <div class="ui fluid container">
      <language-menu v-model="selectedLanguage"></language-menu>
      <options-menu v-model="options" />
      <div id="scrollable-area-container">
        <clipboard-button v-if="tibetan"></clipboard-button>
        <div id="scrollable-area">
          <tibetan-input
            v-model="tibetan"
            :allFields="['#tibetan']"
          ></tibetan-input>
          <transliterated-lines
            :lines="lines"
            :language="selectedLanguage"
            :options="options"
          ></transliterated-lines>
        </div>
      </div>
    </div>
  `
})

Vue.component('transliterated-lines', {
  props: {
    language: String,
    options: Object,
    lines: Array
  },
  computed: {
    transliteratedLines: function() {
      TibetanTransliteratorSettings.change(this.language);
      return this.lines.map((line) => {
        return new TibetanTransliterator(line, this.options).transliterate();
      }).join("\n");
    },
  },
  template: `
    <div class="ui form">
      <textarea id="transliteration" readonly="">{{transliteratedLines}}</textarea>
    </div>
  `
})