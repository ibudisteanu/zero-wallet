<template>
    <div>
        <template>

            <nav :aria-label="label">
                <ul class="pagination m-0">
                    <li class="page-item" v-if="inverted ? current > 1 : current < total - 2">
                        <router-link :to="`${prefix}${inverted ? 0 : total-1}${suffix ? '/'+suffix : '' }`" class="page-link">
                            <span aria-hidden="true">{{inverted ? 0 : total-1}}«</span>
                        </router-link>
                    </li>
                    <li class="page-item" v-if="inverted ? current > 0 : current < total - 1">
                        <router-link :to="`${prefix}${inverted ? current - 1 : current + 1}${suffix ? '/'+suffix : '' }`"  class="page-link">
                            <span aria-hidden="true">{{inverted ? current - 1 : current + 1}}</span>
                        </router-link>
                    </li>
                    <li class="page-item active">
                        <router-link :to="`${prefix}${current}${suffix ? '/'+suffix : '' }`"  class="page-link">
                            <span aria-hidden="true">{{ current }}</span>
                        </router-link>
                    </li>
                    <li class="page-item" v-if="current < total - 1">
                        <router-link :to="`${prefix}${inverted ? current + 1 : current - 1}${suffix ? '/'+suffix : '' }`" class="page-link">
                            <span aria-hidden="true">{{inverted ? current + 1 : current - 1}}</span>
                        </router-link>
                    </li>
                    <li class="page-item" v-if="inverted ? current < total -2 : current < 0">
                        <router-link :to="`${prefix}${inverted ? total -1 : 0}${suffix ? '/'+suffix : '' }`"  class="page-link">
                            <span aria-hidden="true">» {{inverted ? total -1 : 0}}</span>
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
        suffix: {default: ""},
        inverted: {default: false}
    },

    methods: {

    },

}
</script>

<style scoped>

</style>
