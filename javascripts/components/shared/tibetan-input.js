var valll;
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
      <div v-if="!value" id="tibetan-placeholder" @click="selectTextarea">
        Try inputing some Tibetan here...
      </div>
      <textarea
        :value="value"
        @input="checkInput($event.target.value)"
        id="tibetan"
        class="tibetan"
        autofocus="true"
        spellcheck="false"
      ></textarea>
    </div>
  `
});