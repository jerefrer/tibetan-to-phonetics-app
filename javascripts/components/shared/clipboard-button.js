Vue.component('clipboard-button', {
  data: function() {
    return {
      text: 'Copy to clipboard'
    }
  },
  methods: {
    updateText: function() {
      var that = this;
      this.text = 'Copied!'
      setTimeout(function() {
        that.text = 'Copy to clipboard';
      }, 1000)
    }
  },
  mounted() {
    new Clipboard('#copy-to-clipboard');
  },
  template: `
    <div
      id="copy-to-clipboard"
      class="ui button"
      data-clipboard-target="#transliteration"
      v-on:click="updateText"
    >
      <i class="paste icon"></i> {{text}}
    </div>
  `
});