import { toDigit } from '@/util/common'

// TODO: daoでrenderer/mainを分岐

export const state = () => ({
  isWorking: false,
  leftTime: 0,
  timer: { minutes: 0, seconds: 0, title: '' }
})

export const getters = {
  status: (state) => {
    if (state.isWorking && state.leftTime > 0) {
      return 'WORKING'
    } else if (!state.isWorking && state.leftTime > 0) {
      return 'STOPPED'
    } else {
      return 'ZERO'
    }
  },

  progress: (state) => {
    const total = state.timer.minutes * 60 + state.timer.seconds
    if (!total) {
      return 0
    } else {
      return Math.floor((state.leftTime / total) * 100)
    }
  },

  leftTimeText: (state) => {
    const min = Math.floor(state.leftTime / 60)
    const sec = state.leftTime % 60
    return `${toDigit(min)}:${toDigit(sec)}`
  },

  leftTime: (state) => {
    return state.leftTime
  }
}

export const mutations = {
  init (state, setting) {
    state.isWorking = false
    state.leftTime = setting.minutes * 60 + setting.seconds
    state.timer.minutes = setting.minutes
    state.timer.seconds = setting.seconds
    state.timer.title = setting.title
  },

  start (state) {
    state.isWorking = true
  },

  stop (state) {
    state.isWorking = false
  },

  update (state, diff) {
    state.leftTime += diff
  }
}

export const actions = {
  init ({ commit }, setting) {
    commit('init', setting)
  },

  start ({ commit }) {
    commit('start')
  },

  stop ({ commit }) {
    commit('stop')
  },

  tick ({ commit }, diff) {
    commit('update', diff)
  }
}
