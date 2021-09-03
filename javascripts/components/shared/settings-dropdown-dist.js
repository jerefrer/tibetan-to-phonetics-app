"use strict";

Vue.component('settings-dropdown', {
  model: {
    prop: 'value'
  },
  props: {
    value: String,
    withLinkToSetting: {
      type: Boolean,
      "default": function _default() {
        return true;
      }
    }
  },
  computed: {
    settings: function settings() {
      return Settings.all();
    },
    setting: function setting() {
      return Settings.find(this.value);
    }
  },
  mounted: function mounted() {
    var _this = this;

    $(this.$refs.dropdownDiv).dropdown({
      values: _(this.settings).map(function (setting) {
        return {
          value: setting.id,
          html: setting.name,
          name: setting.name,
          selected: _this.value == setting.id
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
  template: "\n    <div class=\"settings\">\n      <div class=\"ui normal selection dropdown\" ref=\"dropdownDiv\">\n        <input type=\"hidden\" />\n        <i class=\"dropdown icon\"></i>\n        <div class=\"text\"></div>\n        <div class=\"menu\">\n        </div>\n      </div>\n      <link-to-edit-setting\n        v-if=\"withLinkToSetting\"\n        class=\"right attached\"\n        :setting=\"setting\"\n      />\n    </div>\n  "
});