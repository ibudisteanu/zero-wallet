<template>

    <modal ref="modal" :title="title" content-class="">
        <template slot="body" >
            <simple-tx :tabs-offset="tabsOffset" :titles-offset="titlesOffset" :tx-data="txData" :tx-name="txName"
                       :buttons-offset="buttonsOffset" @onFinished="() => closeModal()"
                       :public-key="publicKey">

                <template v-for="(_, index) in new Array(tabsOffset+1)">
                    <template :slot="`tab_${index}`">
                        <slot :name="`tab_${index}`"></slot>
                    </template>
                </template>

            </simple-tx>
        </template>
    </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import SimpleTx from "./simple-tx"
export default {

    components: {Modal, SimpleTx},

    data(){
        return{
            publicKey: "",
        }
    },

    props: {
        title: {default: "Simple Tx"},
        tabsOffset: 0,
        titlesOffset: {default: () => []}, //{icon, name}
        txData: {default: ({}) },
        buttonsOffset: {default: () => ({}) },
        txName: {default: ""},
    },

    methods: {
        showModal( publicKey ) {
            Object.assign(this.$data, this.$options.data());
            this.publicKey = publicKey;
            return this.$refs.modal.showModal();
        },

        closeModal() {
            return this.$refs.modal.closeModal();
        },
    },

}
</script>

<style scoped>

</style>
