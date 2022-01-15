<template>

    <div>
        <alert-box v-if="!isLoading && !isFound" type="warning" >
            Address was not found on the blockchain or is empty!
        </alert-box>
        <template v-else-if="account">
            <slot></slot>
        </template>
        <div class="py-3 text-center" v-else>
            <loading-spinner class="fs-3" />
        </div>
    </div>

</template>

<script>
import AlertBox from "src/components/utils/alert-box"
import LoadingSpinner from "src/components/utils/loading-spinner";

export default {

    components: {AlertBox, LoadingSpinner},

    props: {
        account: {default: undefined},
    },

    computed:{
        isLoading(){
            return this.account === undefined
        },
        isFound(){
            return this.account !== null
        },
    }
}
</script>