import { createRouter, createWebHistory } from 'vue-router';
import ProductDetails from '../components/ProductDetails.vue';
import ProductManagement from '../components/ProductManagement.vue';

const routes = [
  {
    path: '/',
    component: ProductManagement,
  },
  {
    path: '/products/:id/details',
    component: ProductDetails,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
