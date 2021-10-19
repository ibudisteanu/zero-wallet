<template>
    <i class="fa fa-spinner fa-spin" v-tooltip.bottom="title" ></i>
</template>

<script>
export default{
    props: {
        title: {default: ""}
    },
}
</script>

<style scoped>
    .fa-spin{
        font-size: 20px;
    }
</style>
