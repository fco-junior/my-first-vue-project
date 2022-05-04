<template>
    <div class="buy-list">
        <h4>{{ msg }}</h4>
        <v-InputText />
        <v-Button icon="pi pi-check" iconPos="center" @click="save()></v-Button>
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
            items: [],
        };
    }
}
</script>

<style scoped>

</style>
