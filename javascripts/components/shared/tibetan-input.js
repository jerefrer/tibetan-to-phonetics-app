Vue.component('tibetan-input', {
  props: ['value'],
  methods: {
    checkInput: function(value) {
      var anyNonTibetanCharacter =
        /[^  \n†◌卍卐\u{f00}-\u{fda}\u{f021}-\u{f042}\u{f162}-\u{f588}]/giu;
      var sanitized = value.replace(anyNonTibetanCharacter, '');
      $('#tibetan').val(sanitized);
      this.$emit('input', sanitized);
    },
    selectTextarea: function() {
      $('#tibetan').focus();
    }
  },
  template: `
    <div class="ui form" style="position: relative;">
      <div v-if="!value" id="tibetan-placeholder" @click="selectTextarea">
        Try inputting some Tibetan here...
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