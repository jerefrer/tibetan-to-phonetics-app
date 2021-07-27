var app;
$(function() {
  Vue.component('tibetan-input', {
    props: ['value'],
    methods: {
      checkInput: function(value) {
        if (value.trim()) {
          var anyWesternCharacter = new RegExp(/[a-zéèêêàââñïîôöûü0-9\#\.\"\'\[\]\{\}\(\)\,\;\:\!\?\%ù\*\$\=\+\-"]/ig);
          if (value.match(anyWesternCharacter)) {
            $('#tibetan').val(value.replace(anyWesternCharacter, '').trim());
            var dimmerDiv = $('#please-input-tibetan');
            dimmerDiv.dimmer('show');
            setTimeout(function() { dimmerDiv.dimmer('hide') }, 2000);
          } else
            this.$emit('input', value);
        } else
          this.$emit('input', value);
      },
      selectTextarea: function() {
        $('#tibetan').focus();
      }
    },
    template: `
      <div class="ui form" style="position: relative;">
        <div v-if="!value" id="tibetan-placeholder" v-on:click="selectTextarea">
          Try inputing some Tibetan here...
        </div>
        <textarea
          v-bind:value="value"
          v-on:input="checkInput($event.target.value)"
          id="tibetan"
          class="tibetan"
          autofocus="true"
        ></textarea>
      </div>
    `,
    updated: function(object) {
      $('#tibetan').autosize();
      setTimeout(function() {
        $('#transliteration').css('height', $('textarea.tibetan').css('height'));
      }, 0)
    }
  });
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
    mounted: function() {
      new Clipboard('#copy-to-clipboard');
    },
    template: `
      <div class="ui form">
        <textarea id="transliteration" readonly="">{{transliteratedLines}}</textarea>
      </div>
    `
  })
  app = new Vue({
    el: '#main',
    data: {
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
            <tibetan-input v-model="tibetan"></tibetan-input>
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
})