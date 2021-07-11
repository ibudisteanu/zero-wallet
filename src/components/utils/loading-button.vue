<template>
    <button type="button" @click="handleClick">

        <loading-spinner v-if="loading" />

        <template v-else>
            <i v-if="icon" :class="icon" />
            <span class="hidden-xs">{{text}}</span>
        </template>

    </button>
</template>

<script>
import LoadingSpinner from "src/components/utils/loading-spinner";
export default{
    components: {LoadingSpinner},
    data : function (){
        return {
            loading:false,
            disabled:false,
        }
    },
    props: {
        canDisable: {default: true},
        text: {default: 'Submit'},
        icon : {default: 'fa fa-share'},
    },
    methods: {
        handleClick(e){

            if (this.disabled && this.canDisable  === true) return false;

            this.loading = true;
            if ( this.canDisable ) this.disabled=true;
            let resolver;

            const promise = new Promise( resolve => {
                resolver = resolve;
            });

            promise.then( answer => {
                this.loading = false;
                if (this.canDisable) this.disabled = false;
            });

            e.stopPropagation();
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
