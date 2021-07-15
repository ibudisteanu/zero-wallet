<template>
    <modal ref="modal" title="Faucet coins" >

        <div class="card-body py-2">
            <div class="tab-content">
                <div>
                    <label>Receive your coins to this address:</label>
                    <div class="address d-flex align-items-center">
                        <account-identicon :address="address.addressEncoded" :size="30" :outer-size="5" />
                        <span class="text-break">{{address.addressEncoded}}</span>
                    </div>
                </div>
            </div>
        </div>

    </modal>
</template>

<script>
import Modal from "src/components/utils/modal"
import AccountIdenticon from "../../wallet/account/account-identicon";
export default {

    components: {AccountIdenticon, Modal},

    data(){
        return{
        }
    },

    computed:{
        address(){
            return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKeyHash] ;
        }
    },

    methods:{
        showModal() {
            Object.assign(this.$data, this.$options.data());
            this.$refs.modal.showModal();
        },

        closeModal() {
            this.$refs.modal.closeModal();
        },
    },

}
</script>

<style scoped>
    .address{
        display: grid;
        grid-template-columns: 30px 1fr;
        grid-column-gap: 10px;
    }
</style>
