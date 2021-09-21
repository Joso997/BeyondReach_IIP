import Vue from 'vue'
import Vuex from 'vuex'
import actions from './modules/actions'
// import getters from './modules/getters'
import mutations from './modules/mutations'
import State from '../types/State'
Vue.use(Vuex)

export const store = new Vuex.Store({
  state!: new State(),
  actions,
  // getters,
  mutations
})
