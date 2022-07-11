<template>
  <Dialog v-model:visible="display" :modal="true">
    <template #header>
      <h3>Confirm delete</h3>
    </template>
    
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-1" style="font-size: 1.5rem" />
      <span> Are you sure you want to delete {{ product.name }}? </span>
    </div>

    <template #footer>
      <Button
        class="p-button-rounded p-button-danger p-button-text"
        icon="pi pi-times"
        label="No"
        @click="close"
      />

      <Button
        class="p-button-rounded p-button-success p-button-text"
        icon="pi pi-check"
        label="Yes"
        @click="deleteProduct(product)"
      />
    </template>
  </Dialog>
</template>

<script>
export default {
  name: 'ModalDeleteProduct',
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
  methods: {
    show() {
      this.display = true;
    },
    close() {
      this.display = false;
    },
    deleteProduct(product) {
      this.close();
      this.$emit('delete-product', product);
    }
  }
};
</script>
