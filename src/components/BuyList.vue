<template>
  <div class="buy-list">
    <Dialog
      header="Update product"
      v-model:visible="displayUpdateProduct"
      :style="{ width: '50vw' }"
      :modal="true"
    >
      <InputText type="text" v-model.trim="product.name" />
      <InputNumber v-model="product.quantity" :min="1" />

      <Button
        class="button"
        icon="pi pi-check"
        label="Update"
        @click="updateProduct"
      />
      <Button
        class="p-button-danger"
        icon="pi pi-times"
        label="Cancel"
        @click="closeDisplayUpdateProduct"
      />
    </Dialog>

    <Dialog
      v-model:visible="displayConfirmDeleteAllProducts"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span>Are you sure you want to delete all products?</span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-text"
          @click="closeDisplayConfirmDeleteAll"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-text"
          @click="deleteAllProducts"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="displayConfirmDeleteProduct"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span>Are you sure you want to delete {{ product.name }}</span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-text"
          @click="closeDisplayConfirmDelete"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-text"
          @click="deleteProduct(product)"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="displayUpdateQuantityProduct"
      :style="{ width: '450px' }"
      header="The product already exists"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span
          >Do you want to change the quantity of the {{ product.name }}</span
        >
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-text"
          @click="closeDisplayUpdateQuantityProduct"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-text"
          @click="openDisplayUpdateProduct(product)"
        />
      </template>
    </Dialog>

    <h3>New Product</h3>

    <InputText v-model.trim="name" placeholder="Product name" />
    <InputNumber
      @input="updateInputNumberVmodelQuantity"
      v-model="quantity"
      placeholder="Quantity"
    />

    <Button
      class="button"
      label="Add"
      icon="pi pi-check"
      @click="saveProduct"
    />
    <Button
      class="p-button-danger"
      label="Clear All"
      :disabled="!products.length"
      icon="pi pi-times"
      @click="openDisplayConfirmDeleteAll"
    />

    <Toast />

    <hr />

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
          <div class="flex" style="justify-content: flex-end">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Search..."
              />
            </span>
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
              class="p-button-rounded p-button-success mr-2"
              @click="openDisplayUpdateProduct(data)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-warning"
              @click="openDisplayConfirmDelete(data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <hr />
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
      name: "",
      quantity: null,
      product: {},
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
      this.quantity = event.value;
    },
    saveProduct() {
      if (!this.name || !this.quantity) {
        alert("Product name cannot be empty and Minimum quantity 1!");
      } else if (this.checkDuplicateName(this.nameCapitalization(this.name))) {
        let product = this.findProductByName(this.name);
        this.openDisplayUpdateQuantityProduct(product);
      } else {
        this.product = {
          id: this.newProductId(),
          name: this.nameCapitalization(this.name),
          quantity: this.quantity,
        };
        this.products.push({ ...this.product });
        this.name = "";
        this.quantity = null;
        this.showSuccessAddProduct(this.product.name);
      }
    },
    updateProduct() {
      if (!this.product.name || !this.product.quantity)
        alert("Product name cannot be empty and Minimum quantity 1!");
      else if (
        this.checkDuplicateNameUpdate(
          this.nameCapitalization(this.product.name),
          this.product.id
        )
      )
        alert("Product name duplicate!");
      else {
        this.products.forEach((content) => {
          if (content.id === this.product.id) {
            let index = this.products.indexOf(content);
            this.products[index] = this.product;
          }
        });
        this.product = {};
        this.closeDisplayUpdateProduct();
      }
    },
    deleteProduct() {
      this.products.forEach((content) => {
        if (content.id === this.product.id) {
          let index = this.products.indexOf(content);
          this.products.splice(index, 1);
        }
      });
      this.closeDisplayConfirmDelete();
    },
    deleteAllProducts() {
      this.products = [];
      this.closeDisplayConfirmDeleteAll();
    },
    newProductId() {
      let id = 1;
      for (let index = 0; index < this.products.length; index++)
        if (this.products[index].id === id) id++;
      return id;
    },
    findProductByName(nameProduct) {
      let product;
      this.products.forEach((content) => {
        if (content.name === nameProduct) product = content;
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
        if (content.name === name && content.id !== this.product.id)
          flag = true;
      });
      return flag;
    },
    showSuccessAddProduct(productName) {
      this.$toast.add({
        severity: "success",
        summary: "",
        detail: productName + "added!",
        life: 3000,
      });
    },
    openDisplayUpdateProduct(product) {
      this.closeDisplayUpdateQuantityProduct();
      this.product = { ...product };
      this.displayUpdateProduct = true;
    },
    closeDisplayUpdateProduct() {
      this.displayUpdateProduct = false;
    },
    openDisplayConfirmDelete(product) {
      this.product = { ...product };
      this.displayConfirmDeleteProduct = true;
    },
    closeDisplayConfirmDelete() {
      this.displayConfirmDeleteProduct = false;
    },
    openDisplayConfirmDeleteAll() {
      this.displayConfirmDeleteAllProducts = true;
    },
    closeDisplayConfirmDeleteAll() {
      this.displayConfirmDeleteAllProducts = false;
    },
    openDisplayUpdateQuantityProduct(product) {
      this.product = { ...product };
      this.displayUpdateQuantityProduct = true;
    },
    closeDisplayUpdateQuantityProduct() {
      this.name = "";
      this.quantity = null;
      this.displayUpdateQuantityProduct = false;
    },
  },
};
</script>