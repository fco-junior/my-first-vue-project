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
      @update-product="showConfirmProductUpdateDialog($event)"
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
          @click="updateProduct"
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
          Are you sure you want to delete {{ product.name }}?
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
          @click="requestDeleteProduct(product)"
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
          @click="showUpdateProductDialog(productModified)"
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
  deleteProduct
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
      return this.product.name ? true : false;
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
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestPostProduct(product) {
      try {
        const response = await postProduct(product);
        let data = response.data;
        this.clearProductVModel();
        this.notification('success', `${data.data.name} added!`);
        this.requestGetAllProducts();
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestDeleteProduct(product) {
      this.hideConfirmProductDialog();
      try {
        let productName = product.name;
        await deleteProduct(product.id);
        this.requestGetAllProducts();
        this.notification('success', `${productName} deleted!`);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    updateProduct() {
      if (this.checkDuplicate(this.products, this.productModified)) {
        this.productModified = this.findProductByName(
          this.capitalization(this.productModified.name)
        );
        this.showConfirmProductUpdateDialog();
        this.hideUpdateProductDialog();
      } else {
        this.products.forEach((product) => {
          if (product.id === this.productModified.id) {
            let index = this.products.indexOf(product);
            this.products[index] = this.productModified;
          }
        });
        this.hideUpdateProductDialog();
        this.notification('success', `${this.productModified.name} updated!`);
        this.productModified = {};
      }
    },
    deleteAllProducts() {
      this.hideConfirmProductDialog();
      this.products.forEach((product) => {
        this.requestDeleteProduct(product);
      });
      this.notification('success', 'All products have been deleted');
    },
    clearProductVModel() {
      this.product = {...""};
    },
    notification(severity, detail) {
      this.$toast.add({ severity, detail, life: 3000 });
    },
    showUpdateProductDialog(product) {
      this.hideConfirmProductUpdateDialog();
      this.productModified = { ...product };
      this.displayProduct = true;
    },
    hideUpdateProductDialog() {
      this.displayProduct = false;
    },
    showConfirmProductDialog(product) {
      this.product = { ...product };
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
