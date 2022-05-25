<template>
  <div class="buy-list">
    <Dialog
      header="Update product"
      v-model:visible="displayProduct"
      :style="{ width: '28.125 rem' }"
      :modal="true"
    >
      <InputText class="input" type="text" v-model.trim="productModified.name" />

      <InputNumber class="input" v-model="productModified.quantity" :min="1" />

      <template #footer>
        <Button
          class="p-button-rounded p-button-danger p-button-text"
          icon="pi pi-times"
          label="Cancel"
          @click="hideUpdateProductDialog"
        />

        <Button
          class="p-button-rounded p-button-text"
          icon="pi pi-check"
          label="Update"
          :disabled="disableUpdateButton"
          @click="updateProduct"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="displayConfirmProduct"
      :style="{ width: '28.125 rem' }"
      header="Confirm"
      :modal="true"
    >
      <div v-if="isDeletingOneProduct" class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-1" style="font-size: 1.5rem" />
        <span> Are you sure you want to delete {{ productModified.name }}? </span>
      </div>
      <div v-else class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-1" style="font-size: 1.5rem" />
        <span> Are you sure you want to delete all products?</span>
      </div>

      <template #footer>
        <Button
          class="p-button-rounded p-button-danger p-button-text"
          icon="pi pi-times"
          label="No"
          @click="hideConfirmProductDialog"
        />

        <Button
          v-if="isDeletingOneProduct"
          class="p-button-rounded p-button-success p-button-text"
          icon="pi pi-check"
          label="Yes"
          @click="deleteProduct(productModified)"
        />

        <Button
          v-else
          class="p-button-rounded p-button-success p-button-text"
          icon="pi pi-check"
          label="Yes"
          @click="deleteAllProducts"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="displayConfirmProductUpdate"
      header="The product already exists"
      :style="{ width: '28.125 rem' }"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-1" style="font-size: 1.5rem" />
        <span> Do you want to update the {{ productModified.name }}?</span>
      </div>

      <template #footer>
        <Button
          class="p-button-danger p-button-text"
          icon="pi pi-times"
          label="No"
          @click="hideConfirmProductUpdateDialog"
        />

        <Button
          class="p-button-rounded p-button-success p-button-text"
          icon="pi pi-check"
          label="Yes"
          @click="showUpdateProductDialog(productModified)"
        />
      </template>
    </Dialog>

    <Toast />

    <div>
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
          <div class="flex justify-content-between">
            <div>
              <h4>New Product</h4>
              <InputText
                class="input"
                v-model.trim="product.name"
                placeholder="Name"
              />

              <InputNumber
                class="input"
                @input="updateInputNumberVmodelQuantity"
                v-model="product.quantity"
                placeholder="Quantity"
              />

              <Button
                class="p-button-rounded p-button-success"
                icon="pi pi-check"
                label="Add"
                :disabled="disableAddButton"
                @click="saveProduct"
              />

              <Button
                class="p-button-rounded p-button-danger"
                icon="pi pi-times"
                label="Clear All"
                :disabled="disableClearAllButton"
                @click="showConfirmProductDialog"
              />
            </div>

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
              @click="showUpdateProductDialog(data)"
            />

            <Button
              class="p-button-rounded p-button-danger"
              icon="pi pi-trash"
              @click="showConfirmProductDialog(data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script>
import { FilterMatchMode, FilterOperator } from 'primevue/api';

export default {
  name: 'BuyList',

  data() {
    return {
      displayConfirmProduct: false,
      displayConfirmProductUpdate: false,
      displayProduct: false,
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
      },
      product: {
        name: '',
        quantity: null
      },
      productModified: {
        name: '',
        quantity: null
      },
      products: [
        { id: 2, name: 'Café', quantity: 5 },
        { id: 3, name: 'Leite', quantity: 2 },
        { id: 1, name: 'Pão', quantity: 10 }
      ]
    };
  },

  computed: {
    disableAddButton() {
      return !this.product.name || !this.product.quantity
    },
    disableUpdateButton() {
      return !this.productModified.name || !this.productModified.quantity
    },
    disableClearAllButton() {
      return !this.products.length;
    },
    isDeletingOneProduct() {
      return this.productModified.name ? true : false;
    }
  },

  methods: {
    saveProduct() {
      if (this.checkDuplicate(this.products, this.product)) {
        this.productModified = this.findProductByName(this.capitalization(this.product.name));
        this.showConfirmProductUpdateDialog();
      } else {
        this.productModified = {
          id: this.generateId(this.products),
          name: this.capitalization(this.product.name),
          quantity: this.product.quantity
        };
        this.products.push({ ...this.productModified });
        this.notification('success', `${this.productModified.name} added!`);
        this.product.name = '';
        this.product.quantity = null;
      }
    },
    updateProduct() {
      if (this.checkDuplicate(this.products, this.productModified)) {
        this.productModified = this.findProductByName(this.capitalization(this.productModified.name));
        this.showConfirmProductUpdateDialog();
        this.hideUpdateProductDialog();
      } else {
        this.products.forEach((product) => {
          if (product.id === this.productModified.id) {
            let index = this.products.indexOf(product);
            this.products[index] = this.productModified;
          }
        });
        this.hideUpdateProductDialog();
        this.notification('success', `${this.productModified.name} updated!`);
        this.productModified = {};
      }
    },
    deleteProduct() {
      this.hideConfirmProductDialog();
      this.products.forEach((product) => {
        if (product.id === this.productModified.id) {
          let index = this.products.indexOf(product);
          this.notification('success', `${this.productModified.name} deleted!`);
          this.products.splice(index, 1);
        }
      });
    },
    deleteAllProducts() {
      this.hideConfirmProductDialog();
      this.products = [];
      this.notification('success', 'All products have been deleted');
    },
    generateId(list = []) {
      let id = 0;
      list.forEach((content) => {
        if (content.id > id) id = content.id;
      });
      return id + 1;
    },
    updateInputNumberVmodelQuantity(event) {
      this.product.quantity = event.value;
    },
    findProductByName(name) {
      let productFound = {};
      this.products.forEach(product => {
        if (product.name === name) productFound = product;
      });
      return productFound;
    },
    capitalization(string) {
      return string[0].toUpperCase() + string.substring(1).toLowerCase();
    },
    checkDuplicate(products, oldProduct) {
      let flag = false;
      products.forEach((product) => {
        if (oldProduct.id) {
          if (product.name === this.capitalization(oldProduct.name) && product.id !== oldProduct.id)
            flag = true;
        } else {
          if (product.name === this.capitalization(oldProduct.name)) flag = true;
        }
      });
      return flag;
    },
    notification(severity, detail) {
      this.$toast.add({ severity, detail, life: 3000 });
    },
    showUpdateProductDialog(product) {
      this.hideConfirmProductUpdateDialog();
      this.productModified = { ...product };
      this.displayProduct = true;
    },
    hideUpdateProductDialog() {
      this.displayProduct = false;
    },
    showConfirmProductDialog(product) {
      this.productModified = { ...product };
      this.displayConfirmProduct = true;
    },
    hideConfirmProductDialog() {
      this.displayConfirmProduct = false;
    },
    showConfirmProductUpdateDialog() {
      this.displayConfirmProductUpdate = true;
    },
    hideConfirmProductUpdateDialog() {
      this.product.name = '';
      this.product.quantity = null;
      this.displayConfirmProductUpdate = false;
    }
  }
};
</script>
