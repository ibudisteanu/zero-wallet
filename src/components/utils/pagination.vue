<template>
    <div>
        <template v-if="total > 0">

            <nav :aria-label="label">
                <ul class="pagination">
                    <li class="page-item" v-if="current > 2">
                        <router-link :to="`${prefix}${1}`"  :disabled="current === 1" class="page-link">
                            <span aria-hidden="true">1 «</span>
                        </router-link>
                    </li>
                    <li class="page-item" v-if="current > 1">
                        <router-link :to="`${prefix}${current-1}`"  :disabled="current === 1" class="page-link">
                            <span aria-hidden="true">{{current-1}}</span>
                        </router-link>
                    </li>
                    <li class="page-item active">
                        <router-link :to="`${prefix}${current}`"  :disabled="current === 1" class="page-link">
                            <span aria-hidden="true">{{current}}</span>
                        </router-link>
                    </li>
                    <li class="page-item" v-if="current < total">
                        <router-link :to="`${prefix}${current+1}`"  :disabled="current === 1" class="page-link">
                            <span aria-hidden="true">{{current+1}}</span>
                        </router-link>
                    </li>
                    <li class="page-item" v-if="current < total-1">
                        <router-link :to="`${prefix}${total}`"  :disabled="current === 1" class="page-link">
                            <span aria-hidden="true">» {{total}}</span>
                        </router-link>
                    </li>
                </ul>
            </nav>

        </template>
    </div>
</template>

<script>
export default {

    props: {
        label: {default: ""},
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

    .pagination{
        margin-bottom: 0;
    }

</style>
