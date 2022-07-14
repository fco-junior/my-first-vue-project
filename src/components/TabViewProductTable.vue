<template>
  <TabView class="tabview-custom">
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
};
</script>
