<template>
  <div class="product-details">
    <Toast />
    <Card class="card">
      <template #title> Product Details </template>
      <template #content>
        <div class="p-card-content">
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
            Active: <strong>{{ isActive }}</strong>
          </p>
          <p>
            Created Date: <strong>{{ product.createdDate }}</strong>
          </p>
          <p>
            Updated Date: <strong>{{ product.updatedDate }}</strong>
          </p>
        </div>
      </template>
      <template #footer>
        <div class="p-card-footer">
          <RouterLink class="link" to="/">
            <Button class="p-button p-button-raised" label="Back" />
          </RouterLink>
        </div>
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
      type: String
    }
  },
  computed: {
    product() {
      return this.$store.state.product;
    },
    isActive() {
      return this.product.isActive ? 'Yes' : 'No';
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
        this.$toast.add({
          severity: 'error',
          detail: `${error.response.data.errors}`,
          life: 2000
        });
      }
    }
  }
};
</script>
