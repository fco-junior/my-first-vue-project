<template>
  <Toolbar class="mb-3">
    <template #start>
      <h3>New Product</h3>
    </template>
    <template #end>
      <InputText
        class="input"
        v-model.trim="product.name"
        placeholder="Enter product name"
        v-tooltip.bottom="'Enter product name'"
      />

      <InputText
        class="input"
        v-model="product.description"
        placeholder="Enter product description"
        v-tooltip.bottom="'Enter product description'"
      />

      <InputNumber
        class="input"
        v-model="product.price"
        mode="decimal"
        locale="en-US"
        :minFractionDigits="2"
        placeholder="Enter product price"
        v-tooltip.bottom="'Enter product price'"
      />

      <Button
        class="p-button-rounded p-button-success"
        icon="pi pi-check"
        label="Confirm"
        :disabled="disableConfirmButton"
        v-tooltip.bottom="'Confirm and save product'"
        @click="saveProduct(product)"
      />
    </template>
  </Toolbar>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      default: new Object()
    }
  },
  computed: {
    disableConfirmButton() {
      return !this.product.name || !this.product.description || !this.product.price;
    }
  },
  methods: {
    saveProduct(product) {
      this.$emit('post-product', product);
    }
  }
};
</script>
