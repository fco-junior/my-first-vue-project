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
        @click="saveProduct"
      />

      <Button
        class="p-button-rounded p-button-danger"
        icon="pi pi-times"
        label="Clear All"
        :disabled="disableClearAllButton"
        @click="confirmDeleteAllProducts"
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
    lenghtOfProducts: {
      type: String
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
    },
    disableClearAllButton() {
      return !this.lenghtOfProducts;
    }
  }
};
</script>
