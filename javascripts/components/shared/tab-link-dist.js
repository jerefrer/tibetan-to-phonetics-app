"use strict";

Vue.component('tab-link', {
  props: {
    tabId: String
  },
  computed: {
    currentTabId: function currentTabId() {
      this.$route.params.tab;
    }
  },
  template: "\n    <router-link\n      :to=\"{ params: { tab: tabId } }\"\n      class=\"item\"\n      :class=\"{active: currentTabId == tabId}\"\n    >\n      <slot />\n    </router-link>\n  "
});