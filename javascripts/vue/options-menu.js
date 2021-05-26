Vue.component('options-menu', {
  model: {
    prop: 'options',
    event: 'change'
  },
  props: {
    options: Object
  },
  template: `
    <div id="options">
      <div><slider-checkbox v-model="options.capitalize" text="Capitalize" /></div>
    </div>
  `
})