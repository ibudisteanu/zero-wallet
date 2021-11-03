<template>
    <modal ref="modal" :title="`Delete Address ${title ? ': ' + title : ''}`">

        <template slot="body" v-if="account">
            <span class="text-break mb-2 d-block">Are you sure you want to <b>delete</b> address {{this.account.name}}</span>
            <div class="address align-items-center">
                <account-identicon :address="this.account.addressEncoded" size="35" outer-size="13" />
                <span class="text-break">{{ this.account.addressEncoded }}</span>
            </div>
        </template>

        <template slot="footer">
            <alert-box v-if="error" class="w-100" type="error" :dismissible-timeout="10000" :dismissible-text="error" @onDismissible="error=''" >{{error}}</alert-box>

            <button class="btn btn-falcon-danger" type="button" @click="handleDelete">
                <i class="fa fa-times"></i> Yes, Delete account
            </button>
            <button class="btn btn-falcon-secondary" type="button" @click="closeModal">
                <i class="fa fa-ban"></i> Close
            </button>
        </template>

    </modal>
</template>

<script>
import Modal from "src/components/utils/modal"
import AlertBox from "../../utils/alert-box";
import UtilsHelper from "src/utils/utils-helper";
import AccountIdenticon from "../../wallet/account/account-identicon";

export default {

    components: { Modal, AlertBox, AccountIdenticon},

    data() {
        return {
            error: '',
            account: null,
            title: "",
        }
    },

    methods: {

        async showModal(account) {

            Object.assign(this.$data, this.$options.data());

            this.account = account;
            this.title = account.name;

            return this.$refs.modal.showModal();

        },

        closeModal() {
            return this.$refs.modal.closeModal();
        },

        async handleDelete(){

            this.$store.state.page.refLoadingModal.showModal();

            await UtilsHelper.sleep(50 )

            const address = this.account

            try{

                const password = await this.$store.state.page.refWalletPasswordModal.showModal()
                if (password === null ) return

                const out = await PandoraPay.wallet.manager.removeWalletAddress( password, address.addressEncoded );
                if (out) {
                    await this.$store.dispatch('addToast', {
                        type: 'success',
                        title: `Address ${address.name} has been removed successfully`,
                        text: `The address ${address.addressEncoded} has been removed and deleted from your wallet`,
                    });
                    this.$store.commit('removeWalletAddress', address)
                }

            }catch(err){
                await this.$store.dispatch('addToast', {
                    type: 'error',
                    title: `Address ${address.addressEncoded} could not been removed`,
                    text: `Raised an error ${err.message}`,
                })
            }finally{
                this.$store.state.page.refLoadingModal.closeModal();
            }


            this.closeModal()
        },

    }

}
</script>

<style scoped>
.address{
    display: grid;
    grid-template-columns: 60px 1fr;
    grid-column-gap: 10px;
}
</style>
