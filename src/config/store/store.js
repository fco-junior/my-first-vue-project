import { createStore } from 'vuex';
import products from './modules/products';

const store = createStore({
  state: {
    product: {}
  },
  modules: {
    products
  }
});

export default store;
