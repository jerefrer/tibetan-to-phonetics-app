Vue.component('link-to-edit-setting', {
  props: {
    setting: Object
  },
  template: `
    <router-link
      :to="{ name: 'edit-setting', params: { settingId: setting.id, tab: 'rules' } }"
      tag="div"
      class="ui icon button"
      :title="setting.isEditable ? 'Edit' : 'Show'"
    >
      <i
        class="icon"
        :class="[setting.isEditable ? 'fa fa-sliders-h' : 'eye']"
      />
    </router-link>
  `
})
