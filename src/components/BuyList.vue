<template>
    <div class="buy-list">
        <h4>{{ msg }}</h4>
        <v-InputText type="text" v-model="value"/>
        <v-Button icon="pi pi-check" iconPos="center" @click="save()" />

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

    
}
</script>

<style scoped>

</style>
