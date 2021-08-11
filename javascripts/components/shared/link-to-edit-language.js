Vue.component('link-to-edit-language', {
  props: {
    language: Object
  },
  template: `
    <router-link
      :to="{ name: 'edit-setting', params: { languageId: language.id } }"
      tag="div"
      class="ui icon button"
    >
      <i
        class="icon"
        :class="[language.isEditable ? 'fa fa-sliders-h' : 'eye']"
      />
    </router-link>
  `
})
