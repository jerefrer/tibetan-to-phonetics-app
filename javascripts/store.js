const store = new Vuex.Store({
  state: {
    rulesUsedForThisText: {}
  },
  mutations: {
    updateRulesUsedForThisText(state, payload) {
      state.rulesUsedForThisText = payload;
    }
  }
})