Vue.component('language-menu', {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: String
  },
  data: function() {
    return {
      languages: TibetanTransliteratorSettings.languages()
    }
  },
  mounted: function() {
    $('.radio').checkbox();
  },
  template: `
    <div id="languages">
      <div
        v-for="(language, index) in languages"
      >
        <div class="ui radio checkbox">
          <input type="radio"
            tabindex="0"
            class="hidden"
            name="language"
            v-bind:value="language"
            v-bind:checked="language == value"
            v-on:change="$emit('change', $event.target.value)">
          <label>{{language.capitalize()}}</label>
        </div>
      </div>
    </div>
  `
})