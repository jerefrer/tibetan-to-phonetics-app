"use strict";

var store = new Vuex.Store({
  state: {
    rulesUsedForThisText: {}
  },
  mutations: {
    updateRulesUsedForThisText: function updateRulesUsedForThisText(state, payload) {
      state.rulesUsedForThisText = payload;
    }
  }
});