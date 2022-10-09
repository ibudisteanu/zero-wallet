<template>
    <modal ref="modal" :title="`Rename Address ${title ? ': ' + title : ''}`">

        <template v-slot:body v-if="account">
            <span class="text-break mb-2 d-block">Do you want to <b>rename</b> address {{this.account.name}} in your wallet</span>
            <div class="address align-items-center">
                <account-identicon :address="this.account.addressEncoded" size="35" outer-size="13" />
                <span class="text-break">{{ this.account.addressEncoded }}</span>
            </div>


            <div class="pt-4">
                <label>Account Name</label>
                <input type="text" class="form-control" v-model="newName" />
            </div>

        </template>

        <template v-slot:footer>
            <button class="btn btn-falcon-primary" type="button" @click="handleRename">
                <i class="fas fa-save"></i> Rename Account
            </button>
            <button class="btn btn-outline-primary" type="button" @click="closeModal">
                <i class="fas fa-ban"></i> Close
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
            account: null,
            title: "",
            newName: "",
        }
    },

    methods: {

        async showModal(account) {

            Object.assign(this.$data, this.$options.data.apply(this))

            this.account = account;
            this.title = account.name;
            this.newName = account.name;

            return this.$refs.modal.showModal();

        },

        closeModal() {
            return this.$refs.modal.closeModal();
        },

        async handleRename(){

            await this.$store.state.page.loadingModal.showModal();

            const address = this.account

            try{

                const password = await this.$store.state.page.walletPasswordModal.showModal()
                if (password === null ) return

                const out = await PandoraPay.wallet.manager.renameWalletAddress( password, address.publicKey, this.newName );
                if (out) {
                    this.$store.dispatch('addToast', {
                        type: 'success',
                        title: `Address ${address.name} has been renamed successfully`,
                        text: `The address ${address.addressEncoded} has been renamed from your wallet`,
                    });
                    this.$store.commit('renameWalletAddress', {publicKey: address.publicKey, name: this.newName })
                }

            }catch(err){
                this.$store.dispatch('addToast', {
                    type: 'error',
                    title: `Address ${address.addressEncoded} could not been renamed`,
                    text: `Raised an error ${err.toString()}`,
                })
            }finally{
                this.$store.state.page.loadingModal.closeModal();
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
