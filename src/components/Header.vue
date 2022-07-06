<template>
  <Toolbar class="mb-3">
    <template #start>
      <h3>New Product</h3>
    </template>
    <template #end>
      <div class="p-float-label">
        <InputText
          class="input"
          id="product-name"
          v-model.trim="product.name"
          v-tooltip.bottom="'Enter product name'"
        />
        <label for="product-name">Product name</label>
      </div>
      <div class="p-float-label">
        <InputText
          class="input"
          id="product-description"
          v-model="product.description"
          v-tooltip.bottom="'Enter product description'"
        />
        <label for="product-description">Product description</label>
      </div>
      <div class="p-float-label">
        <InputNumber
          class="input"
          id="product-price"
          v-model="product.price"
          mode="decimal"
          locale="en-US"
          :minFractionDigits="2"
          v-tooltip.bottom="'Enter product price'"
        />
        <label for="product-price">Product price</label>
      </div>
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
      return (
        !this.product.name || !this.product.description || !this.product.price
      );
    }
  },
  methods: {
    saveProduct(product) {
      this.$emit('post-product', product);
    }
  }
};
</script>
