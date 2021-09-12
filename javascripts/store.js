const store = new Vuex.Store({
  state: {
    rulesUsedForThisText: {},
    exceptionsUsedForThisText: {}
  },
  mutations: {
    updateRulesUsedForThisText(state, payload) {
      state.rulesUsedForThisText = payload;
    },
    updateExceptionsUsedForThisText(state, payload) {
      state.exceptionsUsedForThisText = payload;
    }
  }
})