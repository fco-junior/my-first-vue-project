export default {
  namespaced: true,
  state() {
    return {
      products: []
    };
  },
  mutations: {
    setProducts(state, payload) {
      state.products = payload;
    }
  },
  actions: {
    setProducts({ commit }, payload) {
      commit('loadProducts', payload);
    }
  }
};
