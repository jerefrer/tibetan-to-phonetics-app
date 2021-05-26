Vue.component('slider-checkbox', {
  model: {
    prop: 'value'
  },
  props: {
    value: Boolean,
    text: String
  },
  mounted: function() {
    var vm = this;
    $(vm.$refs.checkbox).checkbox({
      onChange: function(input) {
        vm.$emit('input', $(vm.$refs.checkbox).checkbox('is checked'));
      }
    });
  },
  template: `
    <div class="ui slider checkbox" ref="checkbox">
      <input type="checkbox" :checked="value">
      <label>{{text}}</label>
    </div>
  `
})