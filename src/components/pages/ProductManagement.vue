<template>
  <div class="product-management">
    <Header @post-product="requestPostProduct" />

    <Toast />

    <ProductsTable
      @delete-product="showModalDeleteProduct"
      @update-product="showModalUpdateProduct"
      @change-products-active-inactive="changeProductsActiveInactive"
      @inactive-product="showModalInactiveProduct"
      @active-product="showModalActiveProduct"
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

    <ModalActiveProduct
      ref="modalActiveProduct"
      :product="productModified"
      @active-product="requestPatchActiveProductById"
    />
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
import ModalActiveProduct from '../ModalActiveProduct.vue';

export default {
  name: 'ProductManagement',
  components: {
    ProductsTable,
    Header,
    ModalUpdateProduct,
    ModalDeleteProduct,
    ModalInactiveProduct,
    ModalActiveProduct
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
    showModalActiveProduct(product) {
      this.productModified = { ...product };
      this.$refs.modalActiveProduct.show();
    }
  }
};
</script>
