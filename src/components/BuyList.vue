<template>
  <div class="buy-list">
    <Header
      :product="product"
      :lengthOfProducts="products.length"
      :saveProduct="requestPostProduct"
      :confirmDeleteAllProducts="showConfirmProductDialog"
    />

    <Toast />

    <ProductsTable
      :products="products"
      @delete-product="showConfirmProductDialog($event)"
      @update-product="productModified = $event, showConfirmProductUpdateDialog()"
    />

    <Dialog
      header="Update product"
      v-model:visible="displayProduct"
      :style="{ width: '28.125 rem' }"
      :modal="true"
    >
      <InputText
        class="input"
        type="text"
        v-model.trim="productModified.name"
      />

      <InputText
        class="input"
        type="text"
        v-model="productModified.description"
      />

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
      v-model:visible="displayConfirmProduct"
      :style="{ width: '28.125 rem' }"
      header="Confirm"
      :modal="true"
    >
      <div v-if="isDeletingOneProduct" class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-1" style="font-size: 1.5rem" />
        <span>
          Are you sure you want to delete {{ productModified.name }}?
        </span>
      </div>
      <div v-else class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-1" style="font-size: 1.5rem" />
        <span> Are you sure you want to delete all products?</span>
      </div>

      <template #footer>
        <Button
          class="p-button-rounded p-button-danger p-button-text"
          icon="pi pi-times"
          label="No"
          @click="hideConfirmProductDialog"
        />

        <Button
          v-if="isDeletingOneProduct"
          class="p-button-rounded p-button-success p-button-text"
          icon="pi pi-check"
          label="Yes"
          @click="requestDeleteProduct(productModified)"
        />

        <Button
          v-else
          class="p-button-rounded p-button-success p-button-text"
          icon="pi pi-check"
          label="Yes"
          @click="deleteAllProducts"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="displayConfirmProductUpdate"
      header="The product already exists"
      :style="{ width: '28.125 rem' }"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-1" style="font-size: 1.5rem" />
        <span> Do you want to update the {{ productModified.name }}?</span>
      </div>

      <template #footer>
        <Button
          class="p-button-danger p-button-text"
          icon="pi pi-times"
          label="No"
          @click="hideConfirmProductUpdateDialog"
        />

        <Button
          class="p-button-rounded p-button-success p-button-text"
          icon="pi pi-check"
          label="Yes"
          @click="showUpdateProductDialog"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import ProductsTable from './ProductsTable.vue';
import Header from './Header.vue';
import {
  getAllProducts,
  postProduct,
  deleteProduct,
  putProduct
} from '../services/productsService';

export default {
  name: 'BuyList',
  components: { ProductsTable, Header },
  data() {
    return {
      displayConfirmProduct: false,
      displayConfirmProductUpdate: false,
      displayProduct: false,
      product: {
        name: '',
        description: ''
      },
      productModified: {
        name: '',
        description: ''
      },
      products: []
    };
  },
  computed: {
    disableUpdateButton() {
      return !this.productModified.name || !this.productModified.description;
    },
    isDeletingOneProduct() {
      return this.productModified.id ? true : false;
    }
  },
  async mounted() {
    await this.requestGetAllProducts();
  },
  methods: {
    async requestGetAllProducts() {
      try {
        const response = await getAllProducts();
        let data = [...response.data.data];
        this.products = data;
      } catch (error) {
        this.products = [];
        this.notification('error', `${error.response.data.errors}`, 2000);
      }
    },
    async requestPostProduct(product) {
      try {
        await postProduct(product);
        this.clearProductVModel();
        this.notification('success', `${product.name} added!`, 2000);
        this.requestGetAllProducts();
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`, 2000);
      }
    },
    async requestDeleteProduct(product, lifeNotification) {
      this.hideConfirmProductDialog();
      try {
        await deleteProduct(product.id);
        this.requestGetAllProducts();
        this.notification('success', `${product.name} deleted!`, lifeNotification);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`, 2000);
      }
    },
    async requestPutProduct(product) {
      this.hideUpdateProductDialog();
      try {
        await putProduct(product);
        this.notification('success', `${product.name} updated!`, 2000);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`, 2000);
      }
    },
    async deleteAllProducts() {
      this.hideConfirmProductDialog();
      try {
        this.products.forEach((product) => {
          this.requestDeleteProduct(product, 1);
        });
        this.notification('success', 'All products have been deleted', 2000);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`, 2000);
      }
    },
    clearProductVModel() {
      this.product = { ...'' };
    },
    notification(severity, detail, life) {
      this.$toast.add({ severity, detail, life });
    },
    showUpdateProductDialog() {
      this.hideConfirmProductUpdateDialog();
      this.displayProduct = true;
    },
    hideUpdateProductDialog() {
      this.displayProduct = false;
    },
    showConfirmProductDialog(product) {
      this.productModified = { ...product };
      this.displayConfirmProduct = true;
    },
    hideConfirmProductDialog() {
      this.displayConfirmProduct = false;
    },
    showConfirmProductUpdateDialog() {
      this.displayConfirmProductUpdate = true;
    },
    hideConfirmProductUpdateDialog() {
      this.product.name = '';
      this.product.description = null;
      this.displayConfirmProductUpdate = false;
    }
  }
};
</script>
