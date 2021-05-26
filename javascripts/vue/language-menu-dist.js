"use strict";

Vue.component('language-menu', {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: String
  },
  data: function data() {
    return {
      languages: Settings.languages()
    };
  },
  mounted: function mounted() {
    $('.radio').checkbox();
  },
  template: "\n    <div id=\"languages\">\n      <div\n        v-for=\"(language, index) in languages\"\n      >\n        <div class=\"ui radio checkbox\">\n          <input type=\"radio\"\n            tabindex=\"0\"\n            class=\"hidden\"\n            name=\"language\"\n            v-bind:value=\"language\"\n            v-bind:checked=\"language == value\"\n            v-on:change=\"$emit('change', $event.target.value)\">\n          <label>{{language.capitalize()}}</label>\n        </div>\n      </div>\n    </div>\n  "
});