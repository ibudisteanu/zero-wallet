<template>

    <layout>
        <div class="container pd-top-20">
            <div class="boxed ">

                <h1>Account Details</h1>
                <span>Your account</span>
                <div class="account-info" v-if="address">

                    <account :address="address" />

                    <span class="disabled wordwrap pd-top-20">
                        <span v-if="!showPublicKey" class="pointer" @click="showPublicKey = true">
                            View Public Key
                        </span>
                        <span v-else >
                            Public Key {{address.publicKey}} <i class="fa fa-copy pointer" v-tooltip.bottom="'Copy Public Key'"  @click="copyAddress(address.publicKey)"/>
                        </span>
                    </span>

                    <template v-if="address.type === WalletAddressTypeEnum.WALLET_ADDRESS_TRANSPARENT">

                        <span class="disabled wordwrap pd-top-20">
                            <span v-if="!showPublicKeyHash" class="pointer" @click="showPublicKeyHash = true">
                                View Public Key Hash
                            </span>
                            <span v-else >
                                Public Key Hash {{address.publicKeyHash}} <i class="fa fa-copy pointer" v-tooltip.bottom="'Copy Public Key Hash'" @click="copyAddress(address.publicKeyHash)"/>
                            </span>
                        </span>

                    </template>

                    <div class="buttons-row pd-top-20">

                        <div class="btn">
                            <div class="btn-round" @click="downloadAddress" v-tooltip.bottom="'Download Account'" >
                                <i class="fa fa-download"></i>
                            </div>
                        </div>

                        <div class="btn">
                            <div class="btn-round" @click="deleteAddress" v-tooltip.bottom="'Delete Account'" >
                                <i class="danger fa fa-times"></i>
                            </div>
                        </div>

                        <div class="btn">
                            <div class="btn-round" @click="showPrivateKey" v-tooltip.bottom="'View Private Key'" >
                                <i class="fa fa-eye"></i>
                            </div>
                        </div>

                        <div class="btn" v-if="address.type === WalletAddressTypeEnum.WALLET_ADDRESS_TRANSPARENT">
                            <router-link to="/staking">
                                <div class="btn-round" v-tooltip.bottom="'Delegate stake'" >
                                    <i class="fa fa-piggy-bank"></i>
                                </div>
                            </router-link>
                        </div>


                    </div>

                </div>

                <account-private-key-modal ref="refAccountPrivateKeyModal" :address="address"/>

            </div>
        </div>
    </layout>

</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon";
import FileSaver from 'file-saver'
import consts from 'consts/consts';
import AccountPrivateKeyModal from "src/components/wallet/account/account-private-key.modal"
import Layout from "src/components/layout/layout"
import Account from "src/components/wallet/account/account"
const {WalletAddressTypeEnum} = global.blockchain.blockchain.wallet;
export default {

    components: {AccountIdenticon, AccountPrivateKeyModal, Layout, Account},

    data(){
        return {
            showPublicKey: false,
            showPublicKeyHash: false,
        }
    },


    computed:{

        WalletAddressTypeEnum: () => WalletAddressTypeEnum,

        address(){
            return this.$store.state.addresses.list[this.$store.state.wallet.mainAddress] ;
        }

    },


    methods:{

        async downloadAddress(){

            if ( !Blob)
                return this.$notify({
                    type: 'error',
                    title: `Blob is not supported by your Browser`,
                    text: `Update your browser`,
                })

            const address = await PandoraPay.wallet.manager.getWalletAddressByAddress( this.address.address );
            if (!address) return false;

            const json = address.toJSON();

            const fileName = consts.name + "_" +this.address.name + " "+this.address.address + ".wallet";

            const file = new Blob([JSON.stringify(json)], {type: "application/json;charset=utf-8"});
            FileSaver.saveAs(file, fileName);

            this.$notify({
                type: 'success',
                title: `Address ${this.address.name} has been saved in your machine`,
                text: `The address ${this.address.address} has been saved in the downloads folder.`,
            });


        },

        showPrivateKey(){

            this.$refs.refAccountPrivateKeyModal.showModal(this.address);

        },

        async deleteAddress(){

            const confirmation = confirm( `Are you sure you want to Delete ${this.address.name} ${ this.address.address } `);
            if (!confirmation) return;

            this.$store.state.page.refLoadingModal.showModal();


            try{

                const out = await PandoraPay.wallet.manager.deleteWalletAddressByAddress( this.address.address );
                if (out)
                    this.$notify({
                        type: 'success',
                        title: `Address ${this.address.name} has been removed successfully`,
                        text: `The address ${this.address.address} has been removed and deleted from your wallet`,
                    });

            }catch(err){
                this.$notify({
                    type: 'error',
                    title: `Address ${this.address.address} could not been removed`,
                    text: `Raised an error ${err.message}`,
                })
            }finally{
                this.$store.state.page.refLoadingModal.closeModal();
            }


        },

        copyAddress(key){

            this.$copyText(key).then( e =>
                this.$notify({
                    type: 'success',
                    title: `Copied to clipboard successfully`,
                    text: `${key} copied to clipboard`,
                }),
                e =>
                this.$notify({
                    type: 'error',
                    title: `Clipboard failed`,
                    text: `Failed to copy to clipboard`,
                })
            )

        }

    },

}
</script>

<style scoped>

    .account-info{
        text-align: left;
    }

    .buttons-row .btn{
        display: inline-block;
    }

    .btn-round{
        font-size: 20px;
        width: 40px;
        height: 40px;
        margin-bottom: 10px;
        margin-right: 30px;
    }

    .btn-round i{
        margin-top: 10px;
    }

</style>