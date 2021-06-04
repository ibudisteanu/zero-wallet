<template>
    <div>
        <router-link :to="`${prefix}1`"  :disabled="current === 1">
        <button class="btn-white pointer" :disabled="current === 1"><i class="fa fa-angle-double-left"></i></button>
        </router-link>
        <router-link :to="`${prefix}${current-1}`" :disabled="current === 1" >
        <button class="btn-white pointer" :disabled="current === 1"><i class="fa fa-chevron-left"></i></button>
        </router-link>

        <button class="btn-white btn-pagination">{{current}}/{{total}}</button>

        <router-link :to="`${prefix}${current+1}`" :disabled="current === total">
            <button class="btn-white pointer" :disabled="current === total" ><i class="fa fa-chevron-right"></i></button>
        </router-link>
        <router-link :to="`${prefix}${total}`" :disabled="current === total">
            <button class="btn-white pointer" :disabled="current === total"><i class="fa fa-angle-double-right"></i></button>
        </router-link>
    </div>
</template>

<script>
export default {

    props: {
        total: {default: 0},
        current: {default: 0},
        countPerPage: {default: 20},
        prefix: {default: ""},
    },

    methods: {

    },

}
</script>

<style scoped>

    .btn-white{
        padding: 7px 10px;
    }

    .btn-pagination {
        background-color: gray;
    }

</style>
