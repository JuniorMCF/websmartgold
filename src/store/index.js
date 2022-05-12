import { store } from "quasar/wrappers";
import { createStore } from "vuex";

// import example from './module-example'
import auth from './modules/auth/index'
import home from './modules/home/index'
import products from "./modules/products/index"
import checkout from "./modules/checkout/index"
import cart from './modules/cart/index'
import smartoffers from "./modules/smartoffers/index";
/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */
import createPersistedState from 'vuex-persistedstate'
export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      // example
      auth,
      home,
      products,
      cart,
      checkout,
      smartoffers
    },
    plugins: [createPersistedState()],
    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
  });

  return Store;
});
