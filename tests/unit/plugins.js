import router from '@/config/router';
import store from '@/config/store/store';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

const plugins = [
  router,
  store,
  PrimeVue,
  ToastService
];

export default plugins;