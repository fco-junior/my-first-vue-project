<template>
  <div class="buy-list">
    <Header
      :product="product"
      :lengthOfProducts="products.length"
      @post-product="requestPostProduct"
      :confirmDeleteAllProducts="showConfirmProductDialog"
    />

    <Toast />

    <ProductsTable
      :products="products"
      @search-by-id="requestGetProductById"
      @delete-product="showConfirmProductDialog"
      @update-product="showConfirmProductUpdateDialog"
      @change-products-active-inactive="changeProductsActiveInactive"
      @inactive-product="requestPatchInactiveProductById"
      @active-product="requestPatchActiveProductById"
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
          @click="hideConfirmProductDialog"
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
  getProductById,
  postProduct,
  deleteProduct,
  putProduct,
  pathInactiveProductById,
  pathActiveProductById
} from '../services/productsService';

export default {
  name: 'BuyList',
  components: { ProductsTable, Header },
  data() {
    return {
      displayConfirmProduct: false,
      displayConfirmProductUpdate: false,
      displayProduct: false,
      optionActiveSelected: true,
      product: {
        name: '',
        description: '',
        price: null
      },
      productModified: {
        name: '',
        description: '',
        price: null
      },
      products: []
    };
  },
  computed: {
    disableUpdateButton() {
      return !this.productModified.name || !this.productModified.description;
    }
  },
  async mounted() {
    await this.requestGetAllProducts();
  },
  methods: {
    async requestGetAllProducts() {
      try {
        const response = await getAllProducts(this.optionActiveSelected);
        let data = [...response.data.data];
        this.products = data;
      } catch (error) {
        this.products = [];
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestGetProductById(productId) {
      try {
        const response = await getProductById(productId);
        let data = { ...response.data.data };
        let auxArray = [];
        auxArray.push(data);
        this.products = auxArray;
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestPostProduct(product) {
      try {
        await postProduct(product);
        this.clearProductVModel();
        this.notification('success', `${product.name} added!`);
        this.requestGetAllProducts();
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestDeleteProduct(product) {
      this.hideConfirmProductDialog();
      try {
        await deleteProduct(product.id);
        this.requestGetAllProducts(this.optionActiveSelected);
        this.notification(
          'success',
          `${product.name} deleted!`,
          lifeNotification
        );
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestPutProduct(product) {
      this.hideUpdateProductDialog();
      try {
        await putProduct(product);
        this.requestGetAllProducts(this.optionActiveSelected);
        this.notification('success', `${product.name} updated!`);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestPatchInactiveProductById(product) {
      try {
        await pathInactiveProductById(product.id);
        this.requestGetAllProducts(this.optionActiveSelected);
        this.notification('success', `${product.name} inactivated!`);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestPatchActiveProductById(product) {
      try {
        await pathActiveProductById(product.id);
        this.requestGetAllProducts(this.optionActiveSelected);
        this.notification('success', `${product.name} activated!`);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    changeProductsActiveInactive(option) {
      this.optionActiveSelected = option;
      this.requestGetAllProducts(option);
    },
    clearProductVModel() {
      this.product = { ...'' };
    },
    notification(severity, detail) {
      this.$toast.add({ severity, detail, life: 2000 });
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
    showConfirmProductUpdateDialog(product) {
      this.productModified = {...product};
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
