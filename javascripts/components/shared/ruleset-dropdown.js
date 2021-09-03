Vue.component('ruleset-dropdown', {
  model: {
    prop: 'value'
  },
  props: {
    value: String,
    withLinkToRuleset: {
      type: Boolean,
      default: () => true
    }
  },
  computed: {
    rulesets () {
      return Rulesets.all()
    },
    ruleset () {
      return Rulesets.find(this.value);
    }
  },
  mounted: function() {
    $(this.$refs.dropdownDiv).dropdown({
      values: _(this.rulesets).map((ruleset) => {
        return {
          value: ruleset.id,
          html: ruleset.name,
          name: ruleset.name,
          selected: this.value == ruleset.id
        }
      }),
      onChange: () => {
        setTimeout(() => {
          var value = $(this.$refs.dropdownDiv).dropdown('get value');
          this.$emit('input', value);
        }, 0);
      }
    })
  },
  template: `
    <div class="rulesets">
      <div class="ui normal selection dropdown" ref="dropdownDiv">
        <input type="hidden" />
        <i class="dropdown icon"></i>
        <div class="text"></div>
        <div class="menu">
        </div>
      </div>
      <link-to-edit-ruleset
        v-if="withLinkToRuleset"
        class="right attached"
        :ruleset="ruleset"
      />
    </div>
  `
})