Vue.component('language-menu', {
  model: {
    prop: 'value'
  },
  props: {
    value: String
  },
  computed: {
    languages () {
      return Languages.all()
    },
    language () {
      return Languages.find(this.value);
    }
  },
  mounted: function() {
    $(this.$refs.dropdownDiv).dropdown({
      values: _(this.languages).map((language) => {
        return {
          value: language.id,
          html: language.name,
          name: language.name,
          selected: this.value == language.id
        }
      }),
      onChange: () => {
        setTimeout(() => {
          var value = $(this.$refs.dropdownDiv).dropdown('get value');
          this.$emit('input', value);
        }, 0);
      }
    })
  },
  template: `
    <div class="languages">
      <div class="ui normal selection dropdown" ref="dropdownDiv">
        <input type="hidden" />
        <i class="dropdown icon"></i>
        <div class="text"></div>
        <div class="menu">
        </div>
      </div>
      <link-to-edit-language
        class="right attached"
        :language="language"
      />
    </div>
  `
})