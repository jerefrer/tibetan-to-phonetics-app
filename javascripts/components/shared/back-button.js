Vue.component('back-button', {
  methods: {
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    }
  },
  template: `
    <div id="back-button" class="ui circular icon button" @click="goBack">
      <i
        class="left arrow icon"
      />
    </div>
  `
})