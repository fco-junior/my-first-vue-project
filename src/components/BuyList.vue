<template>
  <div class="buy-list">
    <Dialog
      header="Update product"
      v-model:visible="displayUpdateProduct"
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
      v-model:visible="displayConfirmDeleteAllProducts"
      :style="{ width: '28.125 rem' }"
      header="Confirm Clear All"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-1" style="font-size: 1.5rem" />
        <span> Are you sure you want to delete all products?</span>
      </div>

      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-rounded p-button-danger p-button-text"
          @click="hideConfirmDeleteAllDialog"
        />

        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-rounded p-button-success p-button-text"
          @click="deleteAllProducts"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="displayConfirmDeleteProduct"
      :style="{ width: '28.125 rem' }"
      header="Confirm Delete"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-1" style="font-size: 1.5rem" />
        <span> Are you sure you want to delete {{ productToEdit.name }}?</span>
      </div>

      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-rounded p-button-danger p-button-text"
          @click="hideConfirmDeleteDialog"
        />

        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-rounded p-button-success p-button-text"
          @click="deleteProduct(productToEdit)"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="displayUpdateQuantityProduct"
      :style="{ width: '28.125 rem' }"
      header="The product already exists"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle" />
        <span>Do you want to update the {{ productToEdit.name }}?</span>
      </div>

      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideUpdateProductQuantityDialog"
        />

        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-text"
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
                placeholder="Product name"
              />

              <InputNumber
                @input="updateInputNumberVmodelQuantity"
                class="input"
                v-model="newProduct.quantity"
                placeholder="Quantity"
              />

              <Button
                class="p-button-rounded p-button-success"
                label="Add"
                :disabled="!newProduct.name || !newProduct.quantity"
                icon="pi pi-check"
                @click="saveProduct"
              />

              <Button
                class="p-button-rounded p-button-danger"
                label="Clear All"
                :disabled="!products.length"
                icon="pi pi-times"
                @click="showConfirmDeleteDialogAll"
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
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by id"
            /> </template
        ></Column>

        <Column field="name" header="Name" :sortable="true" style="width: 30%">
          <template #body="{ data }"> {{ data.name }} </template>

          <template #filter="{ filterModel }">
            <InputText
              type="text"
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by name"
            /> </template
        ></Column>

        <Column
          field="quantity"
          header="Quantity"
          :sortable="true"
          style="width: 30%"
        >
          <template #body="{ data }"> {{ data.quantity }} </template>

          <template #filter="{ filterModel }">
            <InputNumber
              v-model="filterModel.value"
              class="p-column-filter"
              placeholder="Search by quantity"
            /> </template
        ></Column>

        <Column header="Actions" style="min-width: 8rem">
          <template #body="{ data }">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded"
              @click="showUpdateProductDialog(data)"
            />

            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger"
              @click="showConfirmDeleteDialog(data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script>
import { FilterMatchMode, FilterOperator } from "primevue/api";

export default {
  name: "BuyList",

  data() {
    return {
      displayUpdateQuantityProduct: false,
      displayUpdateProduct: false,
      displayConfirmDeleteProduct: false,
      displayConfirmDeleteAllProducts: false,
      productToEdit: {
        name: "",
        quantity: null
      },
      newProduct: { 
        name: "",
        quantity: null
      },
      products: [
        { id: 1, name: "Café", quantity: 5 },
        { id: 2, name: "Leite", quantity: 2 },
        { id: 3, name: "Pão", quantity: 10 },
      ],
      filters: {
        global: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        id: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        name: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        quantity: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
      },
    };
  },

  methods: {
    updateInputNumberVmodelQuantity(event) {
      this.newProduct.quantity = event.value;
    },
    saveProduct() {
      if (this.checkDuplicateName(this.nameCapitalization(this.newProduct.name))) {
        this.productToEdit = this.findProductByName(
          this.nameCapitalization(this.newProduct.name)
        );
        this.showUpdateQuantityProductDialog();
      } else {
        this.productToEdit = {
          id: this.newProductId(),
          name: this.nameCapitalization(this.newProduct.name),
          quantity: this.newProduct.quantity,
        };
        this.products.push({ ...this.productToEdit });
        this.newProduct.name = "";
        this.newProduct.quantity = null;
        this.notification("success", `${this.productToEdit.name} added!`);
      }
    },
    updateProduct() {
      if (
        this.checkDuplicateNameUpdate(
          this.nameCapitalization(this.productToEdit.name),
          this.productToEdit.id
        )
      ) {
        this.productToEdit = this.findProductByName(
          this.nameCapitalization(this.productToEdit.name)
        );
        this.showUpdateQuantityProductDialog();
        this.hideUpdateProductDialog();
      } else {
        this.products.forEach((content) => {
          if (content.id === this.productToEdit.id) {
            let index = this.products.indexOf(content);
            this.products[index] = this.productToEdit;
          }
        });
        this.notification("success", `${this.productToEdit.name} updated!`);
        this.productToEdit = {};
        this.hideUpdateProductDialog();
      }
    },
    deleteProduct() {
      this.products.forEach((content) => {
        if (content.id === this.productToEdit.id) {
          let index = this.products.indexOf(content);
          this.notification("success", `${this.productToEdit.name} deleted!`);
          this.products.splice(index, 1);
        }
      });
      this.hideConfirmDeleteDialog();
    },
    deleteAllProducts() {
      this.products = [];
      this.hideConfirmDeleteAllDialog();
      this.notification("success", "All products have been deleted");
    },
    newProductId() {
      let id = 1;
      for (let index = 0; index < this.products.length; index++)
        if (this.products[index].id === id) id++;
      return id;
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
      this.$toast.add({
        severity,
        detail,
        life: 3000,
      });
    },
    showUpdateProductDialog(product) {
      this.hideUpdateProductQuantityDialog();
      this.productToEdit = { ...product };
      this.displayUpdateProduct = true;
    },
    hideUpdateProductDialog() {
      this.displayUpdateProduct = false;
    },
    showConfirmDeleteDialog(product) {
      this.productToEdit = { ...product };
      this.displayConfirmDeleteProduct = true;
    },
    hideConfirmDeleteDialog() {
      this.displayConfirmDeleteProduct = false;
    },
    showConfirmDeleteDialogAll() {
      this.displayConfirmDeleteAllProducts = true;
    },
    hideConfirmDeleteAllDialog() {
      this.displayConfirmDeleteAllProducts = false;
    },
    showUpdateQuantityProductDialog() {
      this.displayUpdateQuantityProduct = true;
    },
    hideUpdateProductQuantityDialog() {
      this.newProduct.name = "";
      this.newProduct.quantity = null;
      this.displayUpdateQuantityProduct = false;
    },
  },
};
</script>