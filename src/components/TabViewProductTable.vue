<template>
  <TabView class="tabview-custom" @tab-change="tabChange">
    <TabPanel>
      <template #header>
        <i class="pi pi-eye" />
        <span>Actives products</span>
      </template>
    </TabPanel>

    <TabPanel>
      <template #header>
        <i class="pi pi-eye-slash" />
        <span>Inactives products</span>
      </template>
    </TabPanel>
  </TabView>
</template>

<script>
export default {
  name: 'TabViewProductTable',
  methods: {
    tabChange(event) {
      let isActive = event.index ? false : true;
      this.$emit('change', isActive);
    }
  }
};
</script>
