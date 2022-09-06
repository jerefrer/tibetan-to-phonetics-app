Vue.component('copy-to-clipboard-button', {
  data: function() {
    return {
      text: 'Copy'
    }
  },
  methods: {
    updateText: function() {
      var that = this;
      this.text = 'Copied!'
      setTimeout(function() {
        that.text = 'Copy';
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
      data-clipboard-target=".clipboard-target"
      @click="updateText"
    >
      <i class="copy icon"></i> {{text}}
    </div>
  `
});