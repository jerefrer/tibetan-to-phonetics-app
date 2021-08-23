"use strict";

var ConvertPage = Vue.component('convert-page', {
  mixins: [initializeFieldsMixin],
  data: function data() {
    return {
      loading: true,
      loadedFields: [],
      numberOfFieldsToLoad: 2,
      selectedRulesetId: Rulesets.defaultRulesetId,
      options: {
        capitalize: true
      }
    };
  },
  watch: {
    selectedRulesetId: function selectedRulesetId(value) {
      Storage.set('selectedRulesetId', value);
    },
    options: {
      deep: true,
      handler: function handler(value) {
        Storage.set('options', value);
      }
    }
  },
  computed: {
    ruleset: function ruleset() {
      return Rulesets.find(this.selectedRulesetId);
    }
  },
  created: function created() {
    this.initializeField('selectedRulesetId', Rulesets.defaultRulesetId);
    this.initializeField('options', {
      capitalize: true
    });
  },
  template: "\n    <transition name=\"fade\" appear>\n\n      <div v-if=\"!loading\" class=\"ui fluid container\">\n\n        <div id=\"menu\">\n\n          <ruleset-dropdown v-model=\"selectedRulesetId\" />\n\n          <slider-checkbox\n            v-model=\"options.capitalize\"\n            text=\"Capital letter at the beginning of each group\"\n          />\n\n        </div>\n\n        <convert-boxes\n          :ruleset=\"ruleset\"\n          :options=\"options\"\n          tibetanStorageKey=\"convert-page\"\n        />\n\n      </div>\n\n    </transition>\n  "
});