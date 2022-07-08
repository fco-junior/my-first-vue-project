<template>
  <div class="header">
    <Toolbar class="mb-3">
      <template #start>
        <h3>New Product</h3>
      </template>
      <template #end>
        <div class="p-float-label">
          <InputText
            id="product-name"
            v-model.trim="product.name"
            v-tooltip.bottom="'Enter product name'"
          />
          <label for="product-name">Product name</label>
        </div>
        <div class="p-float-label">
          <InputText
            id="product-description"
            v-model="product.description"
            v-tooltip.bottom="'Enter product description'"
          />
          <label for="product-description">Product description</label>
        </div>
        <div class="p-float-label">
          <InputNumber
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
          class="p-button-raised p-button-rounded p-button-success"
          icon="pi pi-check"
          label="Confirm"
          :disabled="disableConfirmButton"
          v-tooltip.bottom="'Confirm and save product'"
          @click="saveProduct(product)"
        />
      </template>
    </Toolbar>
  </div>
</template>

<script>
export default {
  name: 'Header',
  computed: {
    product() {
      return this.$store.state.product;
    },
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
