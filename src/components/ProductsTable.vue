<template>
  <div class="product-table">
    <DataTable
      :value="products"
      v-model:filters="filters"
      filterDisplay="menu"
      :globalFilterFields="['id', 'name', 'quantity']"
      responsiveLayout="scroll"
      removableSort
      showGridlines
    >
      <template #empty> No products</template>

      <template #header>
        <div class="flex justify-content-between align-items-center">
          <h3>Products</h3>
          <div>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Search product..."
              />
            </span>
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

      <Column field="quantity" :sortable="true" style="width: 30%">
        <template #header>
          <span aria-label="Quantity Column Header" :tabindex="0">
            Quantity
          </span>
        </template>

        <template #body="{ data }">
          <p
            :aria-label="`Quantity Column Content: ${data.quantity}`"
            :tabindex="0"
          >
            {{ data.quantity }}
          </p>
        </template>

        <template #filter="{ filterModel }">
          <InputNumber
            class="p-column-filter"
            v-model="filterModel.value"
            placeholder="Search by quantity"
          />
        </template>
      </Column>

      <Column style="min-width: 8rem">
        <template #header>
          <span aria-label="Actions Column Header" :tabindex="0">
            Actions
          </span>
        </template>

        <template #body="{ data }">
          <Button
            class="p-button-rounded"
            icon="pi pi-pencil"
            @click="updateProduct(data)"
          />

          <Button
            class="p-button-rounded p-button-danger"
            icon="pi pi-trash"
            @click="deleteProduct(data)"
          />
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
        quantity: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        }
      }
    };
  },
  methods: {
    deleteProduct(product) {
      this.$emit('delete-product', product);
    },
    updateProduct(product) {
      this.$emit('update-product', product);
    }
  }
};
</script>
