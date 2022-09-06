Vue.component('tibetan-input', {
  props: ['value'],
  methods: {
    selectTextarea: function() {
      $('#tibetan').focus();
    }
  },
  template: `
    <div
      class="ui form"
      style="position: relative;"
    >

      <paste-from-clipboard-button
        @paste="$emit('input', $event)"
      />

      <div
        v-if="!value"
        id="tibetan-placeholder"
        @click="selectTextarea"
      >
        Try inputting some Tibetan here...
      </div>

      <textarea
        id="tibetan"
        class="tibetan"
        autofocus="true"
        spellcheck="false"
        :value="value"
        @input="$emit('input', $event.target.value)"
      />

    </div>
  `
});