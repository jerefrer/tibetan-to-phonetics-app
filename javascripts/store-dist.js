"use strict";

var store = new Vuex.Store({
  state: {
    rulesUsedForThisText: {},
    exceptionsUsedForThisText: {}
  },
  mutations: {
    updateRulesUsedForThisText: function updateRulesUsedForThisText(state, payload) {
      state.rulesUsedForThisText = payload;
    },
    updateExceptionsUsedForThisText: function updateExceptionsUsedForThisText(state, payload) {
      state.exceptionsUsedForThisText = payload;
    }
  }
});