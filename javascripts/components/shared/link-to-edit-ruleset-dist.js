"use strict";

Vue.component('link-to-edit-ruleset', {
  props: {
    ruleset: Object
  },
  template: "\n    <router-link\n      :to=\"{ name: 'edit-setting', params: { rulesetId: ruleset.id, tab: 'rules' } }\"\n      tag=\"div\"\n      class=\"ui icon button\"\n      :title=\"ruleset.isEditable ? 'Edit' : 'Show'\"\n    >\n      <i\n        class=\"icon\"\n        :class=\"[ruleset.isEditable ? 'fa fa-sliders-h' : 'eye']\"\n      />\n    </router-link>\n  "
});