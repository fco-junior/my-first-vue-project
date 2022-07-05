<template>
  <Toolbar class="mb-3">
    <template #start>
      <h3>New Product</h3>
    </template>
    <template #end>
      <InputText class="input" v-model.trim="product.name" placeholder="Name"/>

      <InputText
        class="input"
        v-model="product.description"
        placeholder="Description"
      />

      <Button
        class="p-button-rounded p-button-success"
        icon="pi pi-check"
        label="Add"
        :disabled="disableAddButton"
        @click="saveProduct(product)"
      />
    </template>
  </Toolbar>
</template>

<script>
export default {
  props: {
    product: {
      type: Object
    },
    lengthOfProducts: {
      type: Number
    },
    saveProduct: {
      type: Function
    },
    confirmDeleteAllProducts: {
      type: Function
    }
  },
  computed: {
    disableAddButton() {
      return !this.product.name || !this.product.description;
    }
  }
};
</script>
