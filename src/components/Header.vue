<template>
  <Toolbar class="mb-3">
    <template #start>
      <h3>New Product</h3>
    </template>
    <template #end>
      <InputText class="input" v-model.trim="product.name" placeholder="Name" />

      <InputNumber
        class="input"
        @input="updateInputNumberVmodelQuantity"
        v-model="product.quantity"
        placeholder="Quantity"
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
        @click="showConfirmProductDialog"
      />
    </template>
  </Toolbar>
</template>

<script>
export default {
  props: {
    product: {
      type: Object
    }
  },
  methods: {
    updateInputNumberVmodelQuantity(event) {
      this.product.quantity = event.value;
    }
  }
};
</script>
