import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
const app = createApp(App)

import 'primevue/resources/themes/saga-blue/theme.css';       //theme
import 'primevue/resources/primevue.min.css';                 //core css
import 'primeicons/primeicons.css';                           //icons

app.use(PrimeVue)

app.mount('#app')