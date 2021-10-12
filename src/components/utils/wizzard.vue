<template>
    <div class="theme-wizard">
        <div class="card-header bg-light pt-0 pb-2">
            <ul class="nav justify-content-between nav-wizard">
                <li v-for="(title, index) in titles"  class="nav-item"
                    :key="`tab_title_${index}`">
                    <span :class="`nav-link ${tab===index?'active':''} fw-semi-bold`"
                          v-tooltip.bottom="`${title.tooltip}`">
                        <span class="nav-item-circle-parent">
                            <span class="nav-item-circle">
                                <i :class="`${title.icon}`"></i>
                            </span>
                        </span>
                        <span class="d-none d-md-block mt-1 fs--1">{{title.name}}</span>
                    </span>
                </li>
            </ul>
        </div>
        <div class="card-body py-3">
            <div class="tab-content">
                <div v-for="(title, index) in titles" :class="`tab-pane ${tab===index?'active':''}`"
                     :key="`tab_option_${index}`">
                    <slot :name="`tab_${index}`"/>
                </div>
            </div>
        </div>
        <div :class="controlsClassName">
            <alert-box v-if="error" class="w-100" type="error">{{error}}</alert-box>
            <loading-button v-if="tab > 0" text="Back" @submit="handleBack" icon="fas fa-chevron-left ms-2" classCustom="btn btn-link" :iconLeft="false" />
            <loading-button v-if="tab < maxTab" :text="`${tab === maxTab-1 ? 'Generate address' : 'Next'}`" @submit="handleNext" :icon="`${ tab === maxTab-1 ? 'fa fa-cogs' : 'fas fa-chevron-right ms-2' }`"  />
        </div>
    </div>
</template>

<script>
import AlertBox from "src/components/utils/alert-box"
import LoadingButton from "src/components/utils/loading-button"

export default {

    components: {AlertBox, LoadingButton},

    data() {
        return {
            tab: 0,
            maxTab: 3,

            error: '',
        }
    },

    props:{
        titles: {default: () => []}, //{icon, name}
        controlsClassName: {default: ""},
    },

    methods: {

        async setTab(resolver, value) {
            try {

                this.error = ""

                value = Math.max(value, 0)
                value = Math.min(value, this.maxTab + 1)

                const promise = new Promise((resolve, reject)=>{
                    this.$emit('setTab', {resolve, reject, oldTab: this.tab, value} )
                })

                await promise

                this.tab = value
            } catch (err) {
                this.error = err.toString()
            } finally {
                resolver()
            }
        },

        handleBack(resolver) {
            return this.setTab(resolver, this.tab - 1)
        },
        handleNext(resolver) {
            return this.setTab(resolver, this.tab + 1)
        },
    }
}
</script>

<style scoped>
</style>