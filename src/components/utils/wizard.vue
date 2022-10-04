<template>
    <div class="theme-wizard" ref="wizard">
        <div class="card-header bg-light pt-2 pb-2">
            <ul class="nav justify-content-between nav-wizard">
                <li v-for="(titleIndex, index ) in titlesSorted"  class="nav-item"
                    :key="`tab_title_${index}`">
                    <span :class="`nav-link fw-semi-bold ${getIconClass(titleIndex)} ${titleIndex < tab ? 'pointer': ''}`" v-tooltip.bottom="`${titles[titleIndex].tooltip}`" @click="titleIndex < tab ? tab = titleIndex : null ">
                        <span class="nav-item-circle-parent">
                            <span class="nav-item-circle">
                                <i :class="`${titles[titleIndex].icon}`"></i>
                            </span>
                        </span>
                        <span class="d-none d-md-block mt-1 fs--1">{{titles[titleIndex].name}}</span>
                    </span>
                </li>
            </ul>
        </div>
        <div class="card-body py-3">
            <div class="tab-content px-3">
                <div v-for="(titleIndex, index) in titlesSorted" :class="`tab-pane ${tab===titleIndex?'active':''}`"
                     :key="`tab_option_${index}`">
                    <slot :name="`tab_${titleIndex}`"/>
                </div>
            </div>
        </div>
        <div :class="controlsClassName">

            <alert-box v-if="error" class="w-100" type="error" :dismissible-timeout="10000" :dismissible-text="error" @onDismissible="error=''" >{{error}}</alert-box>

            <slot name="wizard-footer" />

            <ul class="pager wizard list-inline mb-0">
                <li class="previous">
                    <loading-button v-if="tab > start" text="Back" @submit="handleBack" icon="fas fa-chevron-left ms-2" classCustom="btn btn-link" :iconLeft="false" />
                </li>
                <li class="next">
                    <loading-button v-if="tab <= end && (!buttons[tab] || !buttons[tab].hide)" :text="`${ buttons[tab] ? buttons[tab].text : 'Next'}`" @submit="handleNext" :icon="`${ buttons[tab] ? buttons[tab].icon : 'fas fa-chevron-right ms-2' }`"  />
                </li>
            </ul>

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
            tab: null,
            error: '',
        }
    },

    props:{
        titles: {default: () => []}, //{icon, name}
        controlsClassName: {default: ""},
        buttons: {default: () => ({}) }, //{icon, text}
        allowScroll: {default: true },
    },

    computed:{
        titlesSorted(){
            const titles = Object.keys(this.titles).filter(it => this.titles[it] !== null )
            return titles.map(it => Number.parseFloat(it)).sort((a,b) => a-b )
        },
        end(){
            return this.titlesSorted[this.titlesSorted.length-1]
        },
        start(){
            return this.titlesSorted[0]
        }
    },

    methods: {

        getIconClass( titleIndex){
            if (titleIndex < this.tab ) return "done"
            if (this.tab === titleIndex) return "active"
            return ''
        },

        async setTab(resolver, value) {
            try {

                this.error = ""

                value = Math.max(value, this.start)
                value = Math.min(value, this.end+1)

                const promise = new Promise((resolve, reject)=>{
                    this.$emit('onSetTab', {resolve, reject, oldTab: this.tab, value} )
                })

                const result = await promise

                if (this.allowScroll)
                    this.$refs.wizard.scrollIntoView({behavior: "smooth"})

                if (result === true) this.tab = value
                else if (typeof result === "number") this.tab = value
            } catch (err) {
                this.error = err.toString()
            } finally {
                resolver()
            }
        },

        handleBack(resolver) {
            for (let i=0; i < this.titlesSorted.length; i++)
                if (this.titlesSorted[i] === this.tab)
                    return this.setTab(resolver, this.titlesSorted[i-1] )
        },
        handleNext(resolver) {
            for (let i=0; i < this.titlesSorted.length; i++)
                if (this.titlesSorted[i] === this.tab)
                    return this.setTab(resolver, (i < this.titlesSorted.length-1) ? this.titlesSorted[i+1] : this.titlesSorted[i] +1 )
        },
    },

    watch:{
        tab:{
            immediate: true,
            handler: function (to, from) {
                if (this.tab === null)
                    this.tab = this.titlesSorted[0]
            }
        },
    },

    mounted(){
    },

}
</script>

<style scoped>
</style>