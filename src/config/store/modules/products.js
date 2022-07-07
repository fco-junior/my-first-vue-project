export default {
  namespaced: true,
  state() {
    return {
      products: []
    };
  },
  mutations: {
    loadProducts(state, payload) {
      state.products = payload;
    }
  },
  actions: {
    loadProducts({ commit }, payload) {
      commit('loadProducts', payload);
    }
  }
};
