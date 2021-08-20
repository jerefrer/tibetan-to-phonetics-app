var ConvertPage = Vue.component('convert-page', {
  mixins: [initializeFieldsMixin],
  data () {
    return {
      loading: true,
      loadedFields: [],
      numberOfFieldsToLoad: 2,
      selectedLanguageId: Languages.defaultLanguageId,
      options: { capitalize: true },
    }
  },
  watch: {
    selectedLanguageId (value) {
      Storage.set('selectedLanguageId', value);
    },
    options: {
      deep: true,
      handler (value) {
        Storage.set('options', value);
      }
    }
  },
  computed: {
    language () {
      return Languages.find(this.selectedLanguageId);
    }
  },
  created () {
    this.initializeField('selectedLanguageId', Languages.defaultLanguageId);
    this.initializeField('options', { capitalize: true });
  },
  template: `
    <transition name="fade" appear>

      <div v-if="!loading" class="ui fluid container">

        <div id="menu">

          <language-menu v-model="selectedLanguageId" />

          <slider-checkbox
            v-model="options.capitalize"
            text="Capital letter at the beginning of each group"
          />

        </div>

        <convert-boxes
          :language="language"
          :options="options"
          tibetanStorageKey="convert-page"
        />

      </div>

    </transition>
  `
})