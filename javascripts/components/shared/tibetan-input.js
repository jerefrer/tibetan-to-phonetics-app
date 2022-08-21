Vue.component('tibetan-input', {
  props: ['value'],
  methods: {
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
        @input="$emit('input', $event.target.value)"
        id="tibetan"
        class="tibetan"
        autofocus="true"
        spellcheck="false"
      ></textarea>
    </div>
  `
});