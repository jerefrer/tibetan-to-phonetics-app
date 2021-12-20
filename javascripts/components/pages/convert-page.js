var ConvertPage = Vue.component('convert-page', {
  mixins: [initializeFieldsMixin],
  data () {
    return {
      loading: true,
      loadedFields: [],
      numberOfFieldsToLoad: 2,
      selectedSettingId: Settings.defaultSettingId,
      options: {
        capitalize: true,
        alternateTibetanAndTransliteration: false
      },
    }
  },
  watch: {
    selectedSettingId (value) {
      Storage.set('selectedSettingId', value);
    },
    options: {
      deep: true,
      handler (value) {
        Storage.set('options', value);
      }
    }
  },
  computed: {
    setting () {
      return Settings.find(this.selectedSettingId);
    }
  },
  created () {
    this.initializeField('selectedSettingId', Settings.defaultSettingId);
    this.initializeField('options', { capitalize: true });
  },
  template: `
    <transition name="fade" appear>

      <div v-if="!loading" class="ui fluid container">

        <div id="menu">

          <settings-dropdown v-model="selectedSettingId" />

          <slider-checkbox
            v-model="options.capitalize"
            text="Capital letter at the beginning of each group"
          />

          <slider-checkbox
            v-model="options.alternateTibetanAndTransliteration"
            text="Alternate Tibetan and transliteration"
          />

        </div>

        <convert-boxes
          :setting="setting"
          :options="options"
          tibetanStorageKey="convert-page"
        />

      </div>

    </transition>
  `
})