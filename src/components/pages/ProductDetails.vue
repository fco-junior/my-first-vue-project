<template>
  <div class="product-details">
    <Toast />
    <Card>
      <template #title> Product Details </template>

      <template #content>
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
      </template>

      <template #footer>
        <RouterLink class="link" to="/">
          <Button
            class="p-button-rounded p-button-raised p-button-success"
            icon="pi pi-table"
            v-tooltip.bottom="'Go to Product Management'"
          />
        </RouterLink>

        <div class="action-buttons">
          <Button
            class="p-button-rounded p-button-raised"
            icon="pi pi-pencil"
            v-tooltip.bottom="'Uptade product'"
          />

          <Button
            v-show="isActive === 'Yes'"
            class="p-button-rounded p-button-raised p-button-secondary"
            icon="pi pi-eye-slash"
            v-tooltip.bottom="'Inactive product'"
          />

          <Button
            v-show="isActive === 'No'"
            class="p-button-rounded p-button-raised p-button-secondary"
            icon="pi pi-eye"
            v-tooltip.bottom="'Active product'"
          />

          <Button
            v-show="isActive === 'No'"
            class="p-button-rounded p-button-raised p-button-danger"
            icon="pi pi-trash"
            v-tooltip.bottom="'Delete product'"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { getProductById } from '../../services/productService';

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
