<template>
  <div class="product-management">
    <Header @post-product="requestPostProduct" />

    <Toast />

    <ProductsTable
      @delete-product="showConfirmDeleteProductDialog"
      @update-product="showUpdateProductDialog"
      @change-products-active-inactive="changeProductsActiveInactive"
      @inactive-product="showConfirmInactiveProductDialog"
      @active-product="showConfirmActiveProductDialog"
    />

    <Dialog
      header="Update product"
      v-model:visible="displayUpdateProduct"
      :modal="true"
    >
      <div class="p-float-label">
        <InputText
          class="input"
          id="product-name"
          type="text"
          v-model.trim="productModified.name"
        />
        <label for="product-name">Product name</label>
      </div>

      <div class="p-float-label">
        <InputText
          class="input"
          id="product-description"
          type="text"
          v-model="productModified.description"
        />
        <label for="product-description">Product description</label>
      </div>

      <div class="p-float-label">
        <InputNumber
          class="input"
          id="product-price"
          v-model="productModified.price"
        />
        <label for="product-price">Product price</label>
      </div>

      <template #footer>
        <Button
          class="p-button-rounded p-button-danger p-button-text"
          icon="pi pi-times"
          label="Cancel"
          @click="hideUpdateProductDialog"
        />

        <Button
          class="p-button-rounded p-button-text"
          icon="pi pi-check"
          label="Update"
          :disabled="disableUpdateButton"
          @click="requestPutProduct(productModified)"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="displayConfirmDeleteProduct"
      :style="{ width: '28.125 rem' }"
      header="Confirm delete"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-1" style="font-size: 1.5rem" />
        <span>
          Are you sure you want to delete {{ productModified.name }}?
        </span>
      </div>

      <template #footer>
        <Button
          class="p-button-rounded p-button-danger p-button-text"
          icon="pi pi-times"
          label="No"
          @click="hideConfirmDeleteProductDialog"
        />

        <Button
          class="p-button-rounded p-button-success p-button-text"
          icon="pi pi-check"
          label="Yes"
          @click="requestDeleteProduct(productModified)"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="displayConfirmInactiveProduct"
      :style="{ width: '28.125 rem' }"
      header="Confirm inactive"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-1" style="font-size: 1.5rem" />
        <span>
          Are you sure you want to inactive {{ productModified.name }}?
        </span>
      </div>

      <template #footer>
        <Button
          class="p-button-rounded p-button-danger p-button-text"
          icon="pi pi-times"
          label="No"
          @click="hideConfirmInactiveProductDialog"
        />

        <Button
          class="p-button-rounded p-button-success p-button-text"
          icon="pi pi-check"
          label="Yes"
          @click="requestPatchInactiveProductById(productModified)"
        />
      </template>
    </Dialog>
    
    <Dialog
      v-model:visible="displayConfirmActiveProduct"
      :style="{ width: '28.125 rem' }"
      header="Confirm active"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-1" style="font-size: 1.5rem" />
        <span>
          Are you sure you want to active {{ productModified.name }}?
        </span>
      </div>

      <template #footer>
        <Button
          class="p-button-rounded p-button-danger p-button-text"
          icon="pi pi-times"
          label="No"
          @click="hideConfirmActiveProductDialog"
        />

        <Button
          class="p-button-rounded p-button-success p-button-text"
          icon="pi pi-check"
          label="Yes"
          @click="requestPatchActiveProductById(productModified)"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import Header from './Header.vue';
import ProductsTable from './ProductsTable.vue';
import {
  getAllProducts,
  postProduct,
  deleteProduct,
  putProduct,
  pathInactiveProductById,
  pathActiveProductById
} from '../services/productsService';
import { mapActions } from 'vuex';

export default {
  name: 'ProductManagement',
  components: { ProductsTable, Header },
  data() {
    return {
      displayConfirmActiveProduct: false,
      displayConfirmInactiveProduct: false,
      displayConfirmDeleteProduct: false,
      displayUpdateProduct: false,
      isActive: true,
      productModified: {}
    };
  },
  computed: {
    product() {
      return this.$store.state.product;
    },
    products() {
      return this.$store.state.products.products;
    },
    disableUpdateButton() {
      return !this.productModified.name || !this.productModified.description;
    }
  },
  async mounted() {
    await this.requestGetAllProducts();
  },
  methods: {
    ...mapActions('products', ['setProducts']),
    async requestGetAllProducts() {
      this.clearFieldsProduct();
      try {
        const response = await getAllProducts(this.isActive);
        let data = [...response.data.data];
        this.setProducts(data);
      } catch (error) {
        this.setProducts([]);
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestPostProduct(product) {
      try {
        let productModified = {
          name: product.name,
          description: product.description,
          price: product.price
        };
        await postProduct(productModified);
        this.notification('success', `${product.name} added!`);
        this.requestGetAllProducts();
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestDeleteProduct(product) {
      this.hideConfirmDeleteProductDialog();
      try {
        await deleteProduct(product.id);
        this.requestGetAllProducts(this.isActive);
        this.notification('success', `${product.name} deleted!`);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestPutProduct(product) {
      this.hideUpdateProductDialog();
      try {
        let productModified = {
          name: product.name,
          description: product.description,
          price: product.price
        };
        await putProduct(product.id, productModified);
        this.requestGetAllProducts(this.isActive);
        this.notification('info', `${product.name} updated!`);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestPatchInactiveProductById(product) {
      this.hideConfirmInactiveProductDialog();
      try {
        await pathInactiveProductById(product.id);
        this.requestGetAllProducts(this.isActive);
        this.notification('info', `${product.name} inactivated!`);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestPatchActiveProductById(product) {
      this.hideConfirmActiveProductDialog();
      try {
        await pathActiveProductById(product.id);
        this.requestGetAllProducts(this.isActive);
        this.notification('info', `${product.name} activated!`);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    changeProductsActiveInactive(option) {
      this.isActive = option;
      this.requestGetAllProducts(option);
    },
    clearFieldsProduct() {
      this.$store.state.product = {};
    },
    notification(severity, detail) {
      this.$toast.add({ severity, detail, life: 2000 });
    },
    showUpdateProductDialog(product) {
      this.productModified = { ...product };
      this.displayUpdateProduct = true;
    },
    hideUpdateProductDialog() {
      this.displayUpdateProduct = false;
    },
    showConfirmDeleteProductDialog(product) {
      this.productModified = { ...product };
      this.displayConfirmDeleteProduct = true;
    },
    hideConfirmDeleteProductDialog() {
      this.displayConfirmDeleteProduct = false;
    },
    showConfirmInactiveProductDialog(product) {
      this.productModified = { ...product };
      this.displayConfirmInactiveProduct = true;
    },
    hideConfirmInactiveProductDialog() {
      this.displayConfirmInactiveProduct = false;
    },
    showConfirmActiveProductDialog(product) {
      this.productModified = { ...product };
      this.displayConfirmActiveProduct = true;
    },
    hideConfirmActiveProductDialog() {
      this.displayConfirmActiveProduct = false;
    }
  }
};
</script>
