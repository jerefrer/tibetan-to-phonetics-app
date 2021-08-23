var ConvertPage = Vue.component('convert-page', {
  mixins: [initializeFieldsMixin],
  data () {
    return {
      loading: true,
      loadedFields: [],
      numberOfFieldsToLoad: 2,
      selectedRulesetId: Rulesets.defaultRulesetId,
      options: { capitalize: true },
    }
  },
  watch: {
    selectedRulesetId (value) {
      Storage.set('selectedRulesetId', value);
    },
    options: {
      deep: true,
      handler (value) {
        Storage.set('options', value);
      }
    }
  },
  computed: {
    ruleset () {
      return Rulesets.find(this.selectedRulesetId);
    }
  },
  created () {
    this.initializeField('selectedRulesetId', Rulesets.defaultRulesetId);
    this.initializeField('options', { capitalize: true });
  },
  template: `
    <transition name="fade" appear>

      <div v-if="!loading" class="ui fluid container">

        <div id="menu">

          <ruleset-dropdown v-model="selectedRulesetId" />

          <slider-checkbox
            v-model="options.capitalize"
            text="Capital letter at the beginning of each group"
          />

        </div>

        <convert-boxes
          :ruleset="ruleset"
          :options="options"
          tibetanStorageKey="convert-page"
        />

      </div>

    </transition>
  `
})