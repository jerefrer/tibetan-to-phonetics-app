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
      languages: Settings.languages()
    }
  },
  mounted: function() {
    $('.radio').checkbox();
  },
  template: `
    <div id="languages" class="ui form">
      <div class="inline fields">
        <div
          v-for="(language, index) in languages"
          class="inline field"
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
    </div>
  `
})