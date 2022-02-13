<template>
    <component :class="`${classCustom}`" type="button" @click="handleClick" :is="component">

        <template v-if="!loaded">
            <loading-spinner v-if="!loaded" />
        </template>
        <template v-else>
            <i v-if="icon && iconLeft" :class="`pe-1 ${icon}`" />
            <span class="hidden-xs">{{text}}</span>
            <i v-if="icon && !iconLeft" :class="`ps-1 ${icon}`" />
        </template>

    </component>
</template>

<script>
import LoadingSpinner from "src/components/utils/loading-spinner";
export default{
    components: {LoadingSpinner},
    data : function (){
        return {
            loaded:true,
            disabled:false,
        }
    },
    props: {
        classCustom: {default: "btn btn-falcon-primary me-1 mb-1"},
        canDisable: {default: true},
        text: {default: 'Submit'},
        icon : {default: 'fas fa-share'},
        iconLeft: {default: true},
        component: {default: "button"},
    },
    methods: {
        handleClick(e){

            if (this.disabled && this.canDisable  === true) return false;

            this.loaded = false;
            if ( this.canDisable ) this.disabled=true;
            let resolver;

            const promise = new Promise( resolve => {
                resolver = resolve;
            });

            promise.then( answer => {
                this.loaded = true;
                if (this.canDisable) this.disabled = false;
            });

            if (e) e.stopPropagation();
            this.$emit('submit', resolver );
        },
    }
}
</script>

<style scoped>
    span{
        display: inline-block;
    }
</style>
