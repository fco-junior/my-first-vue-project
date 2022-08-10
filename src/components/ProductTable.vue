<template>
  <div class="product-table">
    <TabViewProductTable @change="changeProductsActiveInactive" />

    <DataTable
      :value="products"
      v-model:filters="filters"
      :globalFilterFields="['id', 'name', 'description', 'price']"
      filterDisplay="menu"
      removableSort
      showGridlines
      :scrollable="true"
    >
      <template #empty>
        <span tabindex="0">No products found</span>
      </template>

      <template #header>
        <h3 tabindex="0">Product Management</h3>
        <div class="p-float-label">
          <InputText
            id="search-by-id"
            v-model="filters['global'].value"
            v-tooltip.bottom="'Search product...'"
          />
          <label class="pi pi-search" for="search-by-id">
            Search product...
          </label>
        </div>
      </template>

      <Column field="id" :sortable="true" style="width: 20%">
        <template #header>
          <span :aria-label="`ID Column Header`"> ID </span>
        </template>

        <template #body="{ data }">
          <RouterLink
            tabindex="-1"
            class="link"
            :to="`/products/${data.id}/details`"
            v-tooltip.right="'Access product details'"
          >
            <Button
              class="p-button-raised p-button-rounded p-button-secondary p-button-text"
              :label="`${data.id}`"
            />
          </RouterLink>
        </template>

        <template #filter="{ filterModel }">
          <InputNumber
            class="p-column-filter"
            v-model="filterModel.value"
            placeholder="Search by id"
          />
        </template>
      </Column>

      <Column field="name" :sortable="true" style="width: 20%">
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

      <Column field="description" :sortable="true" style="width: 20%">
        <template #header>
          <span aria-label="Description Column Header"> Description </span>
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

      <Column field="price" :sortable="true" style="width: 20%">
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

      <Column class="actions" style="min-width: 20%">
        <template #header>
          <span tabindex="0" aria-label="Actions Column Header"> Actions </span>
        </template>

        <template #body="{ data }">
          <Button
            class="p-button-raised p-button-rounded"
            icon="pi pi-pencil"
            v-tooltip.bottom="'Update produtc'"
            @click="updateProduct(data)"
          />
          <Button
            v-if="isActive"
            class="p-button-raised p-button-rounded p-button-secondary"
            icon="pi pi-eye-slash"
            v-tooltip.bottom="'Inactive produtc'"
            @click="inactiveProduct(data)"
          />
          <Button
            v-else
            class="p-button-raised p-button-rounded p-button-secondary"
            icon="pi pi-eye"
            v-tooltip.bottom="'Active produtc'"
            @click="activeProduct(data)"
          />
          <Button
            v-if="!isActive"
            class="p-button-raised p-button-rounded p-button-danger"
            icon="pi pi-trash"
            v-tooltip.bottom="'Delete product'"
            @click="deleteProduct(data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import TabViewProductTable from './TabViewProductTable.vue';

export default {
  name: 'ProductTable',
  components: { TabViewProductTable },
  data() {
    return {
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
      }
    };
  },
  computed: {
    products() {
      return this.$store.state.products.products;
    }
  },
  methods: {
    deleteProduct(product) {
      this.$emit('delete-product', product);
    },
    updateProduct(product) {
      this.$emit('update-product', product);
    },
    changeProductsActiveInactive(value) {
      this.isActive = value;
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
