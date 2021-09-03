Vue.component('settings-dropdown', {
  model: {
    prop: 'value'
  },
  props: {
    value: String,
    withLinkToSetting: {
      type: Boolean,
      default: () => true
    }
  },
  computed: {
    settings () {
      return Settings.all()
    },
    setting () {
      return Settings.find(this.value);
    }
  },
  mounted: function() {
    $(this.$refs.dropdownDiv).dropdown({
      values: _(this.settings).map((setting) => {
        return {
          value: setting.id,
          html: setting.name,
          name: setting.name,
          selected: this.value == setting.id
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
    <div class="settings">
      <div class="ui normal selection dropdown" ref="dropdownDiv">
        <input type="hidden" />
        <i class="dropdown icon"></i>
        <div class="text"></div>
        <div class="menu">
        </div>
      </div>
      <link-to-edit-setting
        v-if="withLinkToSetting"
        class="right attached"
        :setting="setting"
      />
    </div>
  `
})