"use strict";

Vue.component('slider-checkbox', {
  model: {
    prop: 'value'
  },
  props: {
    value: Boolean,
    text: String
  },
  mounted: function mounted() {
    var vm = this;
    $(vm.$refs.checkbox).checkbox({
      onChange: function onChange(input) {
        vm.$emit('input', $(vm.$refs.checkbox).checkbox('is checked'));
      }
    });
  },
  template: "\n    <div class=\"ui slider checkbox\" ref=\"checkbox\">\n      <input type=\"checkbox\" :checked=\"value\">\n      <label>{{text}}</label>\n    </div>\n  "
});