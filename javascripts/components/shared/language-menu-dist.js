"use strict";

Vue.component('language-menu', {
  model: {
    prop: 'value'
  },
  props: {
    value: String
  },
  computed: {
    languages: function languages() {
      return Languages.all();
    },
    language: function language() {
      return Languages.find(this.value);
    }
  },
  mounted: function mounted() {
    var _this = this;

    $(this.$refs.dropdownDiv).dropdown({
      values: _(this.languages).map(function (language) {
        return {
          value: language.id,
          html: language.name,
          name: language.name,
          selected: _this.value == language.id
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
  template: "\n    <div class=\"languages\">\n      <div class=\"ui normal selection dropdown\" ref=\"dropdownDiv\">\n        <input type=\"hidden\" />\n        <i class=\"dropdown icon\"></i>\n        <div class=\"text\"></div>\n        <div class=\"menu\">\n        </div>\n      </div>\n      <link-to-edit-language\n        class=\"right attached\"\n        :language=\"language\"\n      />\n    </div>\n  "
});