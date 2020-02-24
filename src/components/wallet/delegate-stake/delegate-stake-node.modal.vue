<template>

    <modal ref="modal" title="Delegate Stake">

        <span class="disabled">Node address</span> <br/>
        <select v-model="nodeAddress">
            <option v-for="(node, key) in delegateStakesNodes"
                    :key="`node-${key}`"
                    :value="node.address">
                {{node.address}} Fee: {{node.fee}} %
            </option>
        </select>

        <span v-if="error" class="centered danger">
            {{error}}
        </span>

        <loading-button text="Delegate your stake to node" @submit="handleStopDelegateStake" icon="fa fa-laptop-code"  />

    </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import PasswordInput from "src/components/utils/password-input";
import LoadingButton from "src/components/utils/loading-button.vue"
import consts from "consts/consts"

export default {

    components: {Modal, PasswordInput, LoadingButton},


    data() {
        return {
            delegate: null,
            delegateNonce: 0,
            error: '',

            nodeAddress:'',
        }
    },

    props:{
        address: null,
    },

    computed:{

        isWalletEncrypted() {
            return this.$store.state.wallet.encrypted;
        },

        delegateStakesNodes(){
            return consts.delegateStakesNodes;
        },

    },

    methods: {

        showModal(delegate) {
            Object.assign(this.$data, this.$options.data());

            this.delegate = delegate;
            this.delegateNonce = delegate ? delegate.delegateNonce : 0;

            this.$refs.modal.showModal();
        },


        closeModal() {
            this.$refs.modal.closeModal();
        },

        handleStopDelegateStake(resolve){

            this.error = '';

            try{

                if (!this.nodeAddress) throw "Node Address is not selected"

            }catch(err){
                this.error = err;
            }finally{
                resolve(true);
            }
        }

    },

    mounted(){
        this.nodeAddress = this.delegateStakesNodes[0];
    }

}
</script>

<style scoped>
</style>