"use strict";

Vue.component('link-to-edit-setting', {
  props: {
    setting: Object
  },
  template: "\n    <router-link\n      :to=\"{ name: 'edit-setting', params: { settingId: setting.id, tab: 'rules' } }\"\n      tag=\"div\"\n      class=\"ui icon button\"\n      :title=\"setting.isEditable ? 'Edit' : 'Show'\"\n    >\n      <i\n        class=\"icon\"\n        :class=\"[setting.isEditable ? 'fa fa-sliders-h' : 'eye']\"\n      />\n    </router-link>\n  "
});