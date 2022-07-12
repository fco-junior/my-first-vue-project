<template>
  <div class="product-details">
    <Toast />

    <ModalUpdateProduct
      ref="modalUpdateProduct"
      :product="productModified"
      @update-product="updateProduct"
    />

    <ModalDeleteProduct
      ref="modalDeleteProduct"
      :product="productModified"
      @delete-product="deleteProduct"
    />

    <ModalInactiveProduct
      ref="modalInactiveProduct"
      :product="productModified"
      @inactive-product="inactiveProduct"
    />

    <ModalActiveProduct
      ref="modalActiveProduct"
      :product="productModified"
      @active-product="activeProduct"
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
            icon="pi pi-arrow-left"
            style="width: 7rem"
            label="Back"
            v-tooltip.bottom="'Back to Product Management'"
          />
        </RouterLink>

        <div class="action-buttons">
          <Button
            class="p-button-rounded p-button-raised"
            style="width: 7rem"
            icon="pi pi-pencil"
            label="Edit"
            v-tooltip.bottom="'Edit product'"
            @click="showModalUpdateProduct"
          />

          <Button
            v-show="isActive === 'Yes'"
            class="p-button-rounded p-button-raised p-button-secondary"
            style="width: 7rem"
            icon="pi pi-eye-slash"
            label="Inactive"
            v-tooltip.bottom="'Inactive product'"
            @click="showModalInactiveProduct"
          />

          <Button
            v-show="isActive === 'No'"
            class="p-button-rounded p-button-raised p-button-secondary"
            style="width: 7rem"
            icon="pi pi-eye"
            label="Active"
            v-tooltip.bottom="'Active product'"
            @click="showModalActiveProduct"
          />

          <Button
            v-show="isActive === 'No'"
            class="p-button-rounded p-button-raised p-button-danger"
            style="width: 7rem"
            icon="pi pi-trash"
            label="Delete"
            v-tooltip.bottom="'Delete product'"
            @click="showModalDeleteProduct"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import {
  getProductById,
  putProduct,
  deleteProduct,
  pathInactiveProductById,
  pathActiveProductById
} from '../../services/productService';
import ModalUpdateProduct from '../ModalUpdateProduct.vue';
import ModalDeleteProduct from '../ModalDeleteProduct.vue';
import ModalInactiveProduct from '../ModalInactiveProduct.vue';
import ModalActiveProduct from '../ModalActiveProduct.vue';

export default {
  name: 'ProductDetails',
  components: {
    ModalUpdateProduct,
    ModalDeleteProduct,
    ModalInactiveProduct,
    ModalActiveProduct
  },
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
    showModalDeleteProduct() {
      this.productModified = { ...this.product };
      this.$refs.modalDeleteProduct.show();
    },
    showModalInactiveProduct() {
      this.productModified = { ...this.product };
      this.$refs.modalInactiveProduct.show();
    },
    showModalActiveProduct() {
      this.productModified = { ...this.product };
      this.$refs.modalActiveProduct.show();
    },
    async updateProduct(event) {
      let product = {
        name: event.name,
        description: event.description,
        price: event.price
      };
      await this.requestPutProduct(event.id, product);
    },
    async deleteProduct(event) {
      await this.requestDeleteProduct(event);
    },
    async inactiveProduct(event) {
      await this.requestPatchInactiveProductById(event);
    },
    async activeProduct(event) {
      await this.requestPatchActiveProductById(event);
    },
    async requestGetProductById(id) {
      try {
        const response = await getProductById(id);
        this.product = { ...response.data.data };
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
        this.notification('info', 'Going to Product Management.');
        setTimeout(() => {
          this.$router.push('/products');
        }, 2000);
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
    },
    async requestDeleteProduct(product) {
      try {
        await deleteProduct(product.id);
        this.notification('success', `${product.name} deleted!`);
        this.notification('info', 'Going to Product Management.');
        setTimeout(() => {
          this.$router.push('/products');
        }, 2000);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestPatchInactiveProductById(product) {
      try {
        await pathInactiveProductById(product.id);
        this.requestGetProductById(product.id);
        this.notification('info', `${product.name} inactivated!`);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestPatchActiveProductById(product) {
      try {
        await pathActiveProductById(product.id);
        this.requestGetProductById(product.id);
        this.notification('info', `${product.name} activated!`);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    }
  }
};
</script>
