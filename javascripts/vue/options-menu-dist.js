"use strict";

Vue.component('options-menu', {
  model: {
    prop: 'options',
    event: 'change'
  },
  props: {
    options: Object
  },
  template: "\n    <div id=\"options\">\n      <div>\n        <slider-checkbox\n          v-model=\"options.capitalize\"\n          text=\"Capital letter at the beginning of each group\"\n        />\n      </div>\n    </div>\n  "
});