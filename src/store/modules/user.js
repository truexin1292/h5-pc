const user = {
  state: {
    operationList: [],
    activeLevel: 'operation'
  },
  mutations: {
    setOperationList: (state, menuList) => {
      state.operationList = menuList
    },
    setActiveLevel: (state, type) => {
      state.activeLevel = type
    }
  },
  actions: {
    GetOperationList ({ commit, state }) {
      commit('setActiveLevel', 'operation')
    },
    GetAuthMenuList ({ commit, state }) {
      return Promise.all([ ]).then(resultList => {

      })
    },
    GetGroupList ({ commit, state }) {
      return new Promise((resolve, reject) => {

      })
    }
  }
}

export default user
