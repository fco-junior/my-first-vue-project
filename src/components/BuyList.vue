<template>
  <div class="buy-list">
    <Dialog
      header="Update product"
      v-model:visible="displayProduct"
      :style="{ width: '28.125 rem' }"
      :modal="true"
    >
      <InputText class="input" type="text" v-model.trim="productToEdit.name" />

      <InputNumber class="input" v-model="productToEdit.quantity" :min="1" />

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
          :disabled="!productToEdit.name || !productToEdit.quantity"
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
      <div v-if="verificationConfirmProductDialog" class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-1" style="font-size: 1.5rem" />
        <span> Are you sure you want to delete {{ productToEdit.name }}? </span>
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
          v-if="verificationConfirmProductDialog"
          class="p-button-rounded p-button-success p-button-text"
          icon="pi pi-check"
          label="Yes"
          @click="deleteProduct(productToEdit)"
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
      v-model:visible="displayUpdateQuantityProduct"
      header="The product already exists"
      :style="{ width: '28.125 rem' }"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-1" style="font-size: 1.5rem" />
        <span> Do you want to update the {{ productToEdit.name }}?</span>
      </div>

      <template #footer>
        <Button
          class="p-button-danger p-button-text"
          icon="pi pi-times"
          label="No"
          @click="hideUpdateProductQuantityDialog"
        />

        <Button
          class="p-button-rounded p-button-success p-button-text"
          icon="pi pi-check"
          label="Yes"
          @click="showUpdateProductDialog(productToEdit)"
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
                v-model.trim="newProduct.name"
                placeholder="Name"
              />

              <InputNumber
                class="input"
                @input="updateInputNumberVmodelQuantity"
                v-model="newProduct.quantity"
                placeholder="Quantity"
              />

              <Button
                class="p-button-rounded p-button-success"
                icon="pi pi-check"
                label="Add"
                :disabled="!newProduct.name || !newProduct.quantity"
                @click="saveProduct"
              />

              <Button
                class="p-button-rounded p-button-danger"
                icon="pi pi-times"
                label="Clear All"
                :disabled="!products.length"
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
      newProduct: {
        name: '',
        quantity: null
      },
      products: [
        { id: 2, name: 'Café', quantity: 5 },
        { id: 3, name: 'Leite', quantity: 2 },
        { id: 1, name: 'Pão', quantity: 10 }
      ],
      productToEdit: {
        name: '',
        quantity: null
      }
    };
  },

  computed: {
    verificationConfirmProductDialog() {
      return this.productToEdit.name ? true : false;
    }
  },

  methods: {
    saveProduct() {
      if (this.checkDuplicate(this.products, this.newProduct)) {
        this.productToEdit = this.findProductByName(
          this.nameCapitalization(this.newProduct.name)
        );
        this.showUpdateQuantityProductDialog();
      } else {
        this.productToEdit = {
          id: this.generateId(this.products),
          name: this.nameCapitalization(this.newProduct.name),
          quantity: this.newProduct.quantity
        };
        this.products.push({ ...this.productToEdit });
        this.newProduct.name = '';
        this.newProduct.quantity = null;
        this.notification('success', `${this.productToEdit.name} added!`);
      }
    },
    updateProduct() {
      if (this.checkDuplicate(this.products, this.productToEdit)) {
        this.productToEdit = this.findProductByName(
          this.nameCapitalization(this.productToEdit.name)
        );
        this.showUpdateQuantityProductDialog();
        this.hideUpdateProductDialog();
      } else {
        this.products.forEach((product) => {
          if (product.id === this.productToEdit.id) {
            let index = this.products.indexOf(product);
            this.products[index] = this.productToEdit;
          }
        });
        this.hideUpdateProductDialog();
        this.productToEdit = {};
        this.notification('success', `${this.productToEdit.name} updated!`);
      }
    },
    deleteProduct() {
      this.hideConfirmProductDialog();
      this.products.forEach((content) => {
        if (content.id === this.productToEdit.id) {
          let index = this.products.indexOf(content);
          this.notification('success', `${this.productToEdit.name} deleted!`);
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
      this.newProduct.quantity = event.value;
    },
    findProductByName(name) {
      let product = {};
      this.products.forEach((content) => {
        if (content.name === name) product = content;
      });
      return product;
    },
    nameCapitalization(name) {
      return name[0].toUpperCase() + name.substring(1).toLowerCase();
    },
    checkDuplicate(products, oldProduct) {
      let flag = false;
      products.forEach((product) => {
        if (oldProduct.id) {
          if (product.name === oldProduct.name && product.id !== oldProduct.id)
            flag = true;
        } else {
          if (product.name === oldProduct.name) flag = true;
        }
      });
      return flag;
    },
    checkDuplicateName(name) {
      let flag = false;
      this.products.forEach((content) => {
        if (content.name === name) flag = true;
      });
      return flag;
    },
    checkDuplicateNameUpdate(name) {
      let flag = false;
      this.products.forEach((content) => {
        if (content.name === name && content.id !== this.productToEdit.id)
          flag = true;
      });
      return flag;
    },
    notification(severity, detail) {
      this.$toast.add({ severity, detail, life: 3000 });
    },
    showUpdateProductDialog(product) {
      this.hideUpdateProductQuantityDialog();
      this.productToEdit = { ...product };
      this.displayProduct = true;
    },
    hideUpdateProductDialog() {
      this.displayProduct = false;
    },
    showConfirmProductDialog(product) {
      this.productToEdit = { ...product };
      this.displayConfirmProduct = true;
    },
    hideConfirmProductDialog() {
      this.displayConfirmProduct = false;
    },
    showUpdateQuantityProductDialog() {
      this.displayUpdateQuantityProduct = true;
    },
    hideUpdateProductQuantityDialog() {
      this.newProduct.name = '';
      this.newProduct.quantity = null;
      this.displayUpdateQuantityProduct = false;
    }
  }
};
</script>
