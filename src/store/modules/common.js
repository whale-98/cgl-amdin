const state = {
  searchData: ''
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  SET_SEARCH_DATA: (state, date)=>{
    state.searchData = date
  }
}

const actions = {
  setSearchData({ commit }, data) {
    commit('SET_SEARCH_DATA', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

