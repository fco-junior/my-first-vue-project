<template>
  <div class="product-details">
    <Toast />
    <Card style="width: 25rem; margin-bottom: 2em">
      <template #title> Product Details </template>
      <template #content>
        <p>
          ID: <strong>{{ product.id }}</strong>
        </p>
        <p>
          Name: <strong>{{ product.name }}</strong>
        </p>
        <p>
          Description: <strong>{{ product.description }}</strong>
        </p>
        <p>
          Price: <strong>R$ {{ product.price }}</strong>
        </p>
        <p>
          Created Date: <strong>{{ product.createdDate }}</strong>
        </p>
        <p>
          Updated Date: <strong>{{ product.updatedDate }}</strong>
        </p>
      </template>
      <template #footer>
        <RouterLink to="/"> Back </RouterLink>
      </template>
    </Card>
  </div>
</template>

<script>
import { getProductById } from '@/services/productsService';

export default {
  name: 'ProductDetails',
  props: {
    id: {
      type: Number
    }
  },
  computed: {
    product() {
      return this.$store.state.product;
    }
  },
  async mounted() {
    await this.requestGetProductById(this.id);
  },
  methods: {
    async requestGetProductById(id) {
      try {
        const response = await getProductById(id);
        this.$store.state.product = { ...response.data.data };
      } catch (error) {
        this.$tost.add({
          severity: 'error',
          detail: `${error.response.data.errors}`,
          life: 2000
        });
      }
    }
  }
};
</script>
