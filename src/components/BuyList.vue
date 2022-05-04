<template>
    <div class="buy-list">
        <h4>{{ msg }}</h4>
        <v-InputText />
        <v-Button icon="pi pi-check" iconPos="center"></v-Button>
    </div>
</template>

<script>
export default {
    name: 'BuyList',
    props: {
        msg: String
    }
}
</script>

<style scoped>

</style>
