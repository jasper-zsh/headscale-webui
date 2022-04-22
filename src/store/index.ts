import { createStore } from 'vuex'

export default createStore({
  state: {
    apiKey: 'GhuOOx-P9g.ZcccpflMSplDiF3kNwUBGULCRpYu5KeM_8Cvt7GDfDQ',
    namespace: null
  },
  getters: {
  },
  mutations: {
    setApiKey (state, apiKey) {
      state.apiKey = apiKey
    },
    setNamespace (state, namespace) {
      state.namespace = namespace
    }
  },
  actions: {
  },
  modules: {
  }
})
