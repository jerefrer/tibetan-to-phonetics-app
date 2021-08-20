Vue.component('link-to-edit-language', {
  props: {
    language: Object
  },
  template: `
    <router-link
      :to="{ name: 'edit-setting', params: { languageId: language.id, tab: 'rules' } }"
      tag="div"
      class="ui icon button"
      :title="language.isEditable ? 'Edit' : 'Show'"
    >
      <i
        class="icon"
        :class="[language.isEditable ? 'fa fa-sliders-h' : 'eye']"
      />
    </router-link>
  `
})
