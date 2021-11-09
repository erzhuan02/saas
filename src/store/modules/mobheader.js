const mobheader = {
  state: {
    headerText: '',
    file: {}
  },
  mutations: {
    HEADER_TEXT: (state, data) => {
      state.headerText = data
    },
    FILE: (state, data) => {
      state.file = data
    }
  },
  actions: {}
}
export default mobheader
