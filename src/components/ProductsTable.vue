<template>
  <div class="product-table">
    <DataTable
      :value="products"
      v-model:filters="filters"
      filterDisplay="menu"
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
              v-model="isActive"
              :options="activeOptions"
              optionLabel="name"
              optionValue="value"
              placeholder="active or inactive"
              @change="changeProductsActiveInactive"
            />
          </div>
          <div class="header-table-search">
            <div class="p-float-label">
              <InputNumber
                v-model="searchId"
                id="search-by-id"
                v-tooltip.bottom="'Search product by id'"
              />
              <label for="search-by-id">Search product by id</label>
            </div>
            <Button
              class="ml-2 p-button-success"
              icon="pi pi-search"
              @click="searchById(searchId)"
              :disabled="searchButtonEnable"
              v-tooltip.bottom="'Search product'"
            />
          </div>
        </div>
      </template>

      <Column field="id" :sortable="true" style="width: 25%">
        <template #header>
          <span :aria-label="`ID Column Header`"> ID </span>
        </template>

        <template #body="{ data }">
          <Button
            class="button p-button-text"
            :label="`${data.id}`"
            v-tooltip.right="'Access product details'"
          />
        </template>

        <template #filter="{ filterModel }">
          <InputNumber
            class="p-column-filter"
            v-model="filterModel.value"
            placeholder="Search by id"
          />
        </template>
      </Column>

      <Column field="name" :sortable="true" style="width: 25%">
        <template #header>
          <span aria-label="Name Column Header"> Name </span>
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

      <Column field="description" :sortable="true" style="width: 25%">
        <template #header>
          <span aria-label="Description Column Header">
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

      <Column field="price" :sortable="true" style="width: 25%">
        <template #header>
          <span aria-label="Price Column Header"> Price </span>
        </template>

        <template #body="{ data }">
          <p :aria-label="`Price Column Content: ${data.price}`" :tabindex="0">
            {{ `R$ ${data.price}` }}
          </p>
        </template>

        <template #filter="{ filterModel }">
          <InputNumber
            class="p-column-filter"
            v-model="filterModel.value"
            placeholder="Search by price"
          />
        </template>
      </Column>

      <Column style="min-width: 10rem">
        <template #header>
          <span aria-label="Actions Column Header">
            Actions
          </span>
        </template>

        <template #body="{ data }">
          <div class="action-button">
            <Button
              class="p-button-rounded"
              icon="pi pi-pencil"
              v-tooltip.bottom="'Update produtc'"
              @click="updateProduct(data)"
            />
            <Button
              v-if="isActive"
              class="p-button-rounded p-button-secondary"
              icon="pi pi-eye-slash"
              v-tooltip.bottom="'Inactive produtc'"
              @click="inactiveProduct(data)"
            />
            <Button
              v-else
              class="p-button-rounded p-button-secondary"
              icon="pi pi-eye"
              v-tooltip.bottom="'Active produtc'"
              @click="activeProduct(data)"
            />
            <Button
              v-if="!isActive"
              class="p-button-rounded p-button-danger"
              icon="pi pi-trash"
              v-tooltip.bottom="'Delete product'"
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
  name: 'ProductsTable',
  data() {
    return {
      activeOptions: [
        { name: 'active', value: true },
        { name: 'inactive', value: false }
      ],
      isActive: true,
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
        },
        price: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        }
      },
      searchId: null
    };
  },
  computed: {
    products() {
      return this.$store.state.products.products;
    },
    searchButtonEnable() {
      return this.searchId ? false : true;
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
      this.$emit('change-products-active-inactive', this.isActive);
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
