<template>
  <div class="product-details">
    <Toast />

    <ModalUpdateProduct
      class="p-dialog"
      ref="modalUpdateProduct"
      :product="productModified"
      @update-product="updateProduct"
    />

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
            @click="showModalUpdateProduct"
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
import { getProductById, putProduct } from '../../services/productService';
import ModalUpdateProduct from '../ModalUpdateProduct.vue';

export default {
  name: 'ProductDetails',
  components: { ModalUpdateProduct },
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      product: {},
      productModified: {}
    };
  },
  computed: {
    isActive() {
      return this.product.isActive ? 'Yes' : 'No';
    }
  },
  async mounted() {
    await this.requestGetProductById(this.id);
  },
  methods: {
    notification(severity, detail) {
      this.$toast.add({ severity, detail, life: 2000 });
    },
    showModalUpdateProduct() {
      this.productModified = { ...this.product };
      this.$refs.modalUpdateProduct.show();
    },
    async updateProduct(event) {
      let product = {
        name: event.name,
        description: event.description,
        price: event.price
      };
      await this.requestPutProduct(event.id, product);
    },
    async requestGetProductById(id) {
      try {
        const response = await getProductById(id);
        this.product = { ...response.data.data };
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestPutProduct(id, product) {
      try {
        await putProduct(id, product);
        this.requestGetProductById(id);
        this.notification('info', `${product.name} updated!`);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    }
  }
};
</script>
