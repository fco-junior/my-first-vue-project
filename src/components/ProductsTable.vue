<template>
  <div class="product-table">
    <DataTable
      :value="products"
      v-model:filters="filters"
      filterDisplay="menu"
      :globalFilterFields="['id', 'name', 'quantity']"
      responsiveLayout="scroll"
      removableSort
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

      <Column field="id" header="ID" :sortable="true" style="width: 30%">
        <template #body="{ data }"> {{ data.id }} </template>

        <template #filter="{ filterModel }">
          <InputNumber
            class="p-column-filter"
            v-model="filterModel.value"
            placeholder="Search by id"
          />
        </template>
      </Column>

      <Column field="name" header="Name" :sortable="true" style="width: 30%">
        <template #body="{ data }"> {{ data.name }} </template>

        <template #filter="{ filterModel }">
          <InputText
            class="p-column-filter"
            type="text"
            v-model="filterModel.value"
            placeholder="Search by name"
          />
        </template>
      </Column>

      <Column
        field="quantity"
        header="Quantity"
        :sortable="true"
        style="width: 30%"
      >
        <template #body="{ data }"> {{ data.quantity }} </template>

        <template #filter="{ filterModel }">
          <InputNumber
            class="p-column-filter"
            v-model="filterModel.value"
            placeholder="Search by quantity"
          />
        </template>
      </Column>

      <Column header="Actions" style="min-width: 8rem">
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
  data(){
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
    }
  },
  methods: {
    deleteProduct(product) {
      this.$emit('delete-product', product)
    },
    updateProduct(product) {
      this.$emit('update-product', product)
    }
  }
};
</script>
