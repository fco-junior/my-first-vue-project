import { createRouter, createWebHistory } from 'vue-router';
import ProductDetails from '../components/pages/ProductDetails.vue';
import ProductManagement from '../components/pages/ProductManagement.vue';

const routes = [
  {
    path: '/products',
    component: ProductManagement,
  },
  {
    path: '/products/:id/details',
    component: ProductDetails,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/products'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
