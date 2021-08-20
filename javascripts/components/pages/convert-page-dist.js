"use strict";

var ConvertPage = Vue.component('convert-page', {
  mixins: [initializeFieldsMixin],
  data: function data() {
    return {
      loading: true,
      loadedFields: [],
      numberOfFieldsToLoad: 2,
      selectedLanguageId: Languages.defaultLanguageId,
      options: {
        capitalize: true
      }
    };
  },
  watch: {
    selectedLanguageId: function selectedLanguageId(value) {
      Storage.set('selectedLanguageId', value);
    },
    options: {
      deep: true,
      handler: function handler(value) {
        Storage.set('options', value);
      }
    }
  },
  computed: {
    language: function language() {
      return Languages.find(this.selectedLanguageId);
    }
  },
  created: function created() {
    this.initializeField('selectedLanguageId', Languages.defaultLanguageId);
    this.initializeField('options', {
      capitalize: true
    });
  },
  template: "\n    <transition name=\"fade\" appear>\n\n      <div v-if=\"!loading\" class=\"ui fluid container\">\n\n        <div id=\"menu\">\n\n          <language-menu v-model=\"selectedLanguageId\" />\n\n          <slider-checkbox\n            v-model=\"options.capitalize\"\n            text=\"Capital letter at the beginning of each group\"\n          />\n\n        </div>\n\n        <convert-boxes\n          :language=\"language\"\n          :options=\"options\"\n          tibetanStorageKey=\"convert-page\"\n        />\n\n      </div>\n\n    </transition>\n  "
});