<template>
  <div class="product-management">
    <Header @save-product="saveProduct" />

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
      productModified: {},
      initProducts: [
        {
          name: 'Bean',
          description: 'Description',
          price: 8.5
        },
        {
          name: 'Noodle',
          description: 'Description',
          price: 7
        },
        {
          name: 'Rice',
          description: 'Description',
          price: 7.5
        }
      ]
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
    await this.initializeProducts();
  },
  methods: {
    ...mapActions('products', ['setProducts']),
    async initializeProducts() {
      if (!this.products.length) {
        const response = await getAllProducts(false);
        let data = [...response.data.data];
        if (!data.length)
          await this.initProducts.forEach((product) => {
            this.saveProduct(product);
          });
      }
    },
    async saveProduct(event) {
      let product = {
        name: event.name,
        description: event.description,
        price: event.price
      };
      await this.requestPostProduct(product);
    },
    async deleteProduct(event) {
      await this.requestDeleteProduct(event);
    },
    async updateProduct(event) {
      let product = {
        name: event.name,
        description: event.description,
        price: event.price
      };
      await this.requestPutProduct(event.id, product);
    },
    async inactiveProduct(event) {
      await this.requestPatchInactiveProductById(event);
    },
    async activeProduct(event) {
      await this.requestPatchActiveProductById(event);
    },
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
        await postProduct(product);
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
    async requestPutProduct(id, product) {
      try {
        await putProduct(id, product);
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
