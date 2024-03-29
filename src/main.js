import { createApp } from 'vue';
import App from './App.vue';
import store from './config/store/store';
import router from './config/router';

import PrimeVue from 'primevue/config';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import ConfirmDialog from 'primevue/confirmdialog';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import Toolbar from 'primevue/toolbar';
import Dropdown from 'primevue/dropdown';
import Tooltip from 'primevue/tooltip';
import Card from 'primevue/card';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css'

import './assets/scss/_layout.scss';

const app = createApp(App);

app.use(PrimeVue);
app.use(ToastService);
app.use(store);
app.use(router);

app.directive('tooltip', Tooltip);

app.component('InputText', InputText);
app.component('InputNumber', InputNumber);
app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Dialog', Dialog);
app.component('ConfirmDialog', ConfirmDialog);
app.component('Toast', Toast);
app.component('Toolbar', Toolbar);
app.component('Dropdown', Dropdown);
app.component('Card', Card);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);

app.mount('#app');