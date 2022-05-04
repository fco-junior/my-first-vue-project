<template>
    <div class="buy-list">
        <h4>{{ msg }}</h4>
        <v-InputText type="text" v-model="value"/>
        <v-Button class="button" icon="pi pi-check" iconPos="center" @click="save()" />

        <div class="items" v-for="(item, index) in items" :key="index">
            <label class="item-name">{{ item.value }}</label>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BuyList',
    
    props: {
        msg: String
    },

    data: function () {
        return {
            value: "",
            items: []
        };
    },

    methods: {
        save() {
            this.items.push({
                value: this.value                
            });
            this.value = "";
        }
    }
}
</script>

<style scoped>

.button {
  margin-left: 5px;
}
.items{
  margin: 15px;
}
</style>
