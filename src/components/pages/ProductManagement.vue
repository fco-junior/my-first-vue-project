<template>
  <div class="product-management">
    <Header @post-product="requestPostProduct" />

    <Toast />

    <ProductsTable
      @delete-product="showModalDeleteProduct"
      @update-product="showModalUpdateProduct"
      @change-products-active-inactive="changeProductsActiveInactive"
      @inactive-product="showModalInactiveProduct"
      @active-product="showConfirmActiveProductDialog"
    />

    <ModalUpdateProduct
      ref="modalUpdateProduct"
      :product="productModified"
      @update-product="requestPutProduct"
    />

    <ModalDeleteProduct
      ref="modalDeleteProduct"
      :product="productModified"
      @delete-product="requestDeleteProduct"
    />

    <ModalInactiveProduct
      ref="modalInactiveProduct"
      :product="productModified"
      @inactive-product="requestPatchInactiveProductById"
    />

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
import Header from '../Header.vue';
import ProductsTable from '../ProductTable.vue';
import {
  getAllProducts,
  postProduct,
  deleteProduct,
  putProduct,
  pathInactiveProductById,
  pathActiveProductById
} from '../../services/productService';
import { mapActions } from 'vuex';
import ModalUpdateProduct from '../ModalUpdateProduct.vue';
import ModalDeleteProduct from '../ModalDeleteProduct.vue';
import ModalInactiveProduct from '../ModalInactiveProduct.vue';

export default {
  name: 'ProductManagement',
  components: {
    ProductsTable,
    Header,
    ModalUpdateProduct,
    ModalDeleteProduct,
    ModalInactiveProduct
  },
  data() {
    return {
      displayConfirmActiveProduct: false,
      displayConfirmInactiveProduct: false,
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
      try {
        await deleteProduct(product.id);
        this.requestGetAllProducts(this.isActive);
        this.notification('success', `${product.name} deleted!`);
      } catch (error) {
        this.notification('error', `${error.response.data.errors}`);
      }
    },
    async requestPutProduct(product) {
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
    showModalUpdateProduct(product) {
      this.productModified = { ...product };
      this.$refs.modalUpdateProduct.show();
    },
    showModalDeleteProduct(product) {
      this.productModified = { ...product };
      this.$refs.modalDeleteProduct.show();
    },
    showModalInactiveProduct(product) {
      this.productModified = { ...product };
      this.$refs.modalInactiveProduct.show();
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
