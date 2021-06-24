export const state = () => ({
  list: []
})

export const getters = {
  getlist: (state) => {
    return state.list
  }
}

export const mutations = {
  add (state, log) {
    state.list.unshift(log)
  }
}

export const actions = {
  add ({ commit }, log) {
    commit('add', log)
  }
}
