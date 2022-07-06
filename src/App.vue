<template>
  <div id="#app">
    <ProductManagement />
  </div>
</template>

<script>
import ProductManagement from './components/ProductManagement.vue';

export default {
  name: 'App',
  components: {
    ProductManagement
  }
};
</script>

<style lang="scss">
  @import './App.scss';
</style>
