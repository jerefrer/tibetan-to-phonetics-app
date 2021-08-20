"use strict";

Vue.component('link-to-edit-language', {
  props: {
    language: Object
  },
  template: "\n    <router-link\n      :to=\"{ name: 'edit-setting', params: { languageId: language.id, tab: 'rules' } }\"\n      tag=\"div\"\n      class=\"ui icon button\"\n      :title=\"language.isEditable ? 'Edit' : 'Show'\"\n    >\n      <i\n        class=\"icon\"\n        :class=\"[language.isEditable ? 'fa fa-sliders-h' : 'eye']\"\n      />\n    </router-link>\n  "
});