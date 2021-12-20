"use strict";

var ConvertPage = Vue.component('convert-page', {
  mixins: [initializeFieldsMixin],
  data: function data() {
    return {
      loading: true,
      loadedFields: [],
      numberOfFieldsToLoad: 2,
      selectedSettingId: Settings.defaultSettingId,
      options: {
        capitalize: true,
        alternateTibetanAndTransliteration: false
      }
    };
  },
  watch: {
    selectedSettingId: function selectedSettingId(value) {
      Storage.set('selectedSettingId', value);
    },
    options: {
      deep: true,
      handler: function handler(value) {
        Storage.set('options', value);
      }
    }
  },
  computed: {
    setting: function setting() {
      return Settings.find(this.selectedSettingId);
    }
  },
  created: function created() {
    this.initializeField('selectedSettingId', Settings.defaultSettingId);
    this.initializeField('options', {
      capitalize: true
    });
  },
  template: "\n    <transition name=\"fade\" appear>\n\n      <div v-if=\"!loading\" class=\"ui fluid container\">\n\n        <div id=\"menu\">\n\n          <settings-dropdown v-model=\"selectedSettingId\" />\n\n          <slider-checkbox\n            v-model=\"options.capitalize\"\n            text=\"Capital letter at the beginning of each group\"\n          />\n\n          <slider-checkbox\n            v-model=\"options.alternateTibetanAndTransliteration\"\n            text=\"Alternate Tibetan and transliteration\"\n          />\n\n        </div>\n\n        <convert-boxes\n          :setting=\"setting\"\n          :options=\"options\"\n          tibetanStorageKey=\"convert-page\"\n        />\n\n      </div>\n\n    </transition>\n  "
});