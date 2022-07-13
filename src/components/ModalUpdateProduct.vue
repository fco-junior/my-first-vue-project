<template>
  <Dialog v-model:visible="display" :modal="true">
    <template #header>
      <h3>Edit product</h3>
    </template>

    <div class="content">
      <div>
        <p>Name</p>
        <InputText class="input" type="text" v-model.trim="product.name" />
      </div>

      <div>
        <p>Description</p>
        <InputText class="input" type="text" v-model="product.description" />
      </div>

      <div>
        <p>Price</p>
        <InputNumber
          class="input"
          v-model="product.price"
          mode="decimal"
          locale="en-US"
          :minFractionDigits="2"
        />
      </div>
    </div>

    <template #footer>
      <Button
        class="p-button-rounded p-button-danger p-button-text p-button-raised"
        icon="pi pi-times"
        label="Cancel"
        @click="close"
      />

      <Button
        class="p-button-rounded p-button-text p-button-raised"
        icon="pi pi-check"
        label="Update"
        :disabled="disableUpdateButton"
        @click="updateProduct(product)"
      />
    </template>
  </Dialog>
</template>

<script>
export default {
  name: 'ModalUpdateProduct',
  props: {
    product: {
      type: Object,
      default: new Object()
    }
  },
  data() {
    return {
      display: false
    };
  },
  computed: {
    disableUpdateButton() {
      return (
        !this.product.name || !this.product.description || !this.product.price
      );
    }
  },
  methods: {
    show() {
      this.display = true;
    },
    close() {
      this.display = false;
    },
    updateProduct(product) {
      this.close();
      this.$emit('update-product', product);
    }
  }
};
</script>
