"use strict";

Vue.component('tibetan-input', {
  props: ['value'],
  methods: {
    checkInput: function checkInput(value) {
      if (value.trim()) {
        var anyWesternCharacter = new RegExp(/[a-zéèêêàââñïîôöûü0-9\#\.\"\'\[\]\{\}\(\)\,\;\:\!\?\%ù\*\$\=\+\-"]/ig);

        if (value.match(anyWesternCharacter)) {
          $('#tibetan').val(value.replace(anyWesternCharacter, '').trim());
          var dimmerDiv = $('#please-input-tibetan');
          dimmerDiv.dimmer('show');
          setTimeout(function () {
            dimmerDiv.dimmer('hide');
          }, 2000);
        } else this.$emit('input', value);
      } else this.$emit('input', value);
    },
    selectTextarea: function selectTextarea() {
      $('#tibetan').focus();
    }
  },
  template: "\n    <div class=\"ui form\" style=\"position: relative;\">\n      <div v-if=\"!value\" id=\"tibetan-placeholder\" v-on:click=\"selectTextarea\">\n        Try inputing some Tibetan here...\n      </div>\n      <textarea\n        v-bind:value=\"value\"\n        v-on:input=\"checkInput($event.target.value)\"\n        id=\"tibetan\"\n        class=\"tibetan\"\n        autofocus=\"true\"\n      ></textarea>\n    </div>\n  "
});