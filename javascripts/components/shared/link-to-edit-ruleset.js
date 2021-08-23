Vue.component('link-to-edit-ruleset', {
  props: {
    ruleset: Object
  },
  template: `
    <router-link
      :to="{ name: 'edit-setting', params: { rulesetId: ruleset.id, tab: 'rules' } }"
      tag="div"
      class="ui icon button"
      :title="ruleset.isEditable ? 'Edit' : 'Show'"
    >
      <i
        class="icon"
        :class="[ruleset.isEditable ? 'fa fa-sliders-h' : 'eye']"
      />
    </router-link>
  `
})
