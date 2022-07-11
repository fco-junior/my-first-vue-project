<template>
  <Dialog v-model:visible="display" :modal="true">
    <template #header>
      <h3>Confirm inactive</h3>
    </template>

    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-1" style="font-size: 1.5rem" />
      <span> Are you sure you want to inactive {{ product.name }}? </span>
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
        @click="inactiveProduct(product)"
      />
    </template>
  </Dialog>
</template>

<script>
export default {
  name: 'ModalInactiveProduct',
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
    inactiveProduct(product) {
      this.close();
      this.$emit('inactive-product', product);
    }
  }
};
</script>
