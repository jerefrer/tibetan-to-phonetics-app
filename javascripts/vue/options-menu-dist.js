"use strict";

Vue.component('options-menu', {
  model: {
    prop: 'options',
    event: 'change'
  },
  props: {
    options: Object
  },
  template: "\n    <div id=\"options\">\n      <div><slider-checkbox v-model=\"options.capitalize\" text=\"Capitalize\" /></div>\n    </div>\n  "
});