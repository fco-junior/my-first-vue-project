<template>
  <div class="product-details">
    <Toast />
    <Card class="card">
      <template #title> Product Details </template>
      <template #content>
        <div class="p-card-content">
          <span>
            ID: <strong>{{ product.id }}</strong>
          </span>
          <span>
            Name: <strong>{{ product.name }}</strong>
          </span>
          <span>
            Description: <strong>{{ product.description }}</strong>
          </span>
          <span>
            Price: <strong>R$ {{ product.price }}</strong>
          </span>
          <span>
            Active: <strong>{{ isActive }}</strong>
          </span>
          <span>
            Created Date: <strong>{{ product.createdDate }}</strong>
          </span>
          <span>
            Updated Date: <strong>{{ product.updatedDate }}</strong>
          </span>
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
