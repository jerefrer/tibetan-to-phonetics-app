Vue.component('tab-link', {
  props: {
    tabId: String
  },
  computed: {
    currentTabId () {
      return this.$route.params.tab
    }
  },
  template: `
    <router-link
      :to="{ params: { tab: tabId } }"
      class="item"
      :class="{active: currentTabId == tabId}"
    >
      <slot />
    </router-link>
  `
})