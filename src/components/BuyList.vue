<template>
  <div class="buy-list">
    <Header
      :product="product"
      :lenghtOfProducts="products.length"
      :saveProduct="saveProduct"
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
          @click="deleteProduct(productModified)"
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
import { getAllProducts } from '../services/productsService';

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
      products: [
        { id: 1, name: 'Café', description: 'Tipo 1' },
        { id: 2, name: 'Leite', description: 'Tipo 1' },
        { id: 3, name: 'Pão', description: 'Tipo 1' }
      ]
    };
  },
  computed: {
    disableUpdateButton() {
      return !this.productModified.name || !this.productModified.description;
    },
    isDeletingOneProduct() {
      return this.productModified.name ? true : false;
    }
  },
  async mounted() {
    await this.requestGetAllProducts();
  },
  methods: {
    async requestGetAllProducts() {
      try {
        const response = await getAllProducts();
        let data = response.data.data;
        console.log(data)
        this.products = data;
      } catch {
        this.products = [];
      }
    },
    saveProduct() {
      if (this.checkDuplicate(this.products, this.product)) {
        this.productModified = this.findProductByName(
          this.capitalization(this.product.name)
        );
        this.showConfirmProductUpdateDialog();
      } else {
        this.productModified = {
          id: this.generateId(this.products),
          name: this.capitalization(this.product.name),
          description: this.product.description
        };
        this.products.push({ ...this.productModified });
        this.notification('success', `${this.productModified.name} added!`);
        this.product.name = '';
        this.product.description = '';
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
    deleteProduct() {
      this.hideConfirmProductDialog();
      this.products.forEach((product) => {
        if (product.id === this.productModified.id) {
          let index = this.products.indexOf(product);
          this.notification('success', `${this.productModified.name} deleted!`);
          this.products.splice(index, 1);
        }
      });
    },
    deleteAllProducts() {
      this.hideConfirmProductDialog();
      this.products = [];
      this.notification('success', 'All products have been deleted');
    },
    generateId(list = []) {
      let id = 0;
      list.forEach((content) => {
        if (content.id > id) id = content.id;
      });
      return id + 1;
    },
    findProductByName(name) {
      let productFound = {};
      this.products.forEach((product) => {
        if (product.name === name) productFound = product;
      });
      return productFound;
    },
    capitalization(string) {
      return string[0].toUpperCase() + string.substring(1).toLowerCase();
    },
    checkDuplicate(products, oldProduct) {
      let flag = false;
      products.forEach((product) => {
        if (oldProduct.id) {
          if (
            product.name === this.capitalization(oldProduct.name) &&
            product.id !== oldProduct.id
          )
            flag = true;
        } else {
          if (product.name === this.capitalization(oldProduct.name))
            flag = true;
        }
      });
      return flag;
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
