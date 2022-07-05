<template>
  <div class="product-table">
    <DataTable
      :value="products"
      v-model:filters="filters"
      filterDisplay="menu"
      :globalFilterFields="['id', 'name', 'description']"
      responsiveLayout="scroll"
      removableSort
      showGridlines
    >
      <template #empty> No products</template>

      <template #header>
        <div class="flex justify-content-between align-items-center">
          <div class="header-table">
            <h3>Products</h3>
            <Dropdown
              class="dropdown"
              v-model="activeOptionSelected"
              :options="activeOptions"
              optionLabel="name"
              optionValue="value"
              placeholder="active or inactive"
              @change="changeProductsActiveInactive"
            />
          </div>
          <div v-if="enableSearchById">
            <InputText
              v-model="searchId"
              placeholder="Search product by id..."
            />
            <Button
              class="ml-2 p-button-success"
              icon="pi pi-search"
              @click="searchById(searchId)"
              :disabled="searchButtonEnable"
            />
          </div>
        </div>
      </template>

      <Column field="id" :tabindex="-1" :sortable="true" style="width: 30%">
        <template #header>
          <span :aria-label="`ID Column Header`" :tabindex="0"> ID </span>
        </template>

        <template #body="{ data }">
          <p :aria-label="`ID Column Content: ${data.id}`" :tabindex="0">
            {{ data.id }}
          </p>
        </template>

        <template #filter="{ filterModel }">
          <InputNumber
            class="p-column-filter"
            v-model="filterModel.value"
            placeholder="Search by id"
          />
        </template>
      </Column>

      <Column field="name" :sortable="true" style="width: 30%">
        <template #header>
          <span aria-label="Name Column Header" :tabindex="0"> Name </span>
        </template>

        <template #body="{ data }">
          <p :aria-label="`Name Column Content: ${data.name}`" :tabindex="0">
            {{ data.name }}
          </p>
        </template>

        <template #filter="{ filterModel }">
          <InputText
            class="p-column-filter"
            type="text"
            v-model="filterModel.value"
            placeholder="Search by name"
          />
        </template>
      </Column>

      <Column field="description" :sortable="true" style="width: 30%">
        <template #header>
          <span aria-label="Description Column Header" :tabindex="0">
            Description
          </span>
        </template>

        <template #body="{ data }">
          <p
            :aria-label="`Description Column Content: ${data.description}`"
            :tabindex="0"
          >
            {{ data.description }}
          </p>
        </template>

        <template #filter="{ filterModel }">
          <InputText
            class="p-column-filter"
            type="text"
            v-model="filterModel.value"
            placeholder="Search by description"
          />
        </template>
      </Column>

      <Column style="min-width: 10rem">
        <template #header>
          <span aria-label="Actions Column Header" :tabindex="0">
            Actions
          </span>
        </template>

        <template #body="{ data }">
          <div class="action-button">
            <Button
              class="p-button-rounded"
              icon="pi pi-pencil"
              @click="updateProduct(data)"
            />
            <Button
              v-if="activeOrInactiveButton"
              class="p-button-rounded p-button-secondary"
              icon="pi pi-eye-slash"
              @click="inactiveProduct(data)"
            />
            <Button
              v-else
              class="p-button-rounded p-button-secondary"
              icon="pi pi-eye"
              @click="activeProduct(data)"
            />
            <Button
              v-if="!enableDeleteButton"
              class="p-button-rounded p-button-danger"
              icon="pi pi-trash"
              @click="deleteProduct(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import { FilterMatchMode, FilterOperator } from 'primevue/api';

export default {
  props: {
    products: {
      type: Array
    }
  },
  data() {
    return {
      activeOptions: [
        { name: 'active', value: true },
        { name: 'inactive', value: false }
      ],
      activeOptionSelected: true,
      filters: {
        global: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        },
        id: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        },
        name: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        },
        description: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        }
      },
      searchId: null
    };
  },
  computed: {
    searchButtonEnable() {
      return this.searchId ? false : true;
    },
    enableDeleteButton() {
      return this.activeOptionSelected;
    },
    activeOrInactiveButton() {
      return this.activeOptionSelected;
    },
    enableSearchById() {
      return this.activeOptionSelected;
    }
  },
  methods: {
    deleteProduct(product) {
      this.$emit('delete-product', product);
    },
    updateProduct(product) {
      this.$emit('update-product', product);
    },
    searchById(id) {
      this.searchId = null;
      this.$emit('search-by-id', id);
    },
    changeProductsActiveInactive() {
      this.$emit('change-products-active-inactive', this.activeOptionSelected);
    },
    inactiveProduct(product) {
      this.$emit('inactive-product', product);
    },
    activeProduct(product) {
      this.$emit('active-product', product);
    }
  }
};
</script>
