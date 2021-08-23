"use strict";

Vue.component('ruleset-dropdown', {
  model: {
    prop: 'value'
  },
  props: {
    value: String
  },
  computed: {
    rulesets: function rulesets() {
      return Rulesets.all();
    },
    ruleset: function ruleset() {
      return Rulesets.find(this.value);
    }
  },
  mounted: function mounted() {
    var _this = this;

    $(this.$refs.dropdownDiv).dropdown({
      values: _(this.rulesets).map(function (ruleset) {
        return {
          value: ruleset.id,
          html: ruleset.name,
          name: ruleset.name,
          selected: _this.value == ruleset.id
        };
      }),
      onChange: function onChange() {
        setTimeout(function () {
          var value = $(_this.$refs.dropdownDiv).dropdown('get value');

          _this.$emit('input', value);
        }, 0);
      }
    });
  },
  template: "\n    <div class=\"rulesets\">\n      <div class=\"ui normal selection dropdown\" ref=\"dropdownDiv\">\n        <input type=\"hidden\" />\n        <i class=\"dropdown icon\"></i>\n        <div class=\"text\"></div>\n        <div class=\"menu\">\n        </div>\n      </div>\n      <link-to-edit-ruleset\n        class=\"right attached\"\n        :ruleset=\"ruleset\"\n      />\n    </div>\n  "
});