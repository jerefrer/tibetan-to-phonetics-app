Vue.component('paste-from-clipboard-button', {
  methods: {
    pasteFromClipBoard () {
      navigator.clipboard.readText().then((value) => {
        this.$emit('paste', value);
      })
    }
  },
  template: `
    <div
      id="paste-from-clipboard"
      class="ui button"
      @click="pasteFromClipBoard"
    >
      <i class="paste icon"></i> Paste
    </div>
  `
});