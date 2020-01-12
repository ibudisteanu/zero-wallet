<template>

    <layout>
        <div class="container pd-top-40">
            <div class="boxed ">

                <h1>Account Details</h1>

                <div class="account-info">

                    <account :identicon="address.identicon" :name="address.name" :address="address.address" />

                    <div class="pd-top-40" />

                    <span class="disabled wordwrap ">
                        <span v-if="!showPublicKey" class="pointer" @click="showPublicKey = true">
                            View Public Key
                        </span>
                        <span v-else >
                            Public Key {{address.publicKey}} <i class="fa fa-copy pointer"  @click="copyAddress(address.publicKey)"/>
                        </span>
                    </span> <br/>

                    <span class="disabled wordwrap ">
                        <span v-if="!showPublicKeyHash" class="pointer" @click="showPublicKeyHash = true">
                            View Public Key Hash
                        </span>
                        <span v-else >
                            Public Key Hash {{address.publicKeyHash}} <i class="fa fa-copy pointer"  @click="copyAddress(address.publicKeyHash)"/>
                        </span>
                    </span>

                    <div class="buttons-row pd-top-20">

                        <div class="btn">
                            <div class="btn-round" @click="downloadAddress" v-tooltip.bottom="'Download Account'" >
                                <i class="fa fa-download"></i>
                            </div>
                        </div>

                        <div class="btn">
                            <div class="btn-round" @click="deleteAddress" v-tooltip.bottom="'Delete'" >
                                <i class="danger fa fa-times"></i>
                            </div>
                        </div>

                        <div class="btn">
                            <div class="btn-round" @click="showPrivateKey" v-tooltip.bottom="'View Private Key'" >
                                <i class="fa fa-eye"></i>
                            </div>
                        </div>

                    </div>

                </div>

                <account-private-key-modal ref="refAccountPrivateKeyModal"/>

            </div>
        </div>
    </layout>

</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon";
import FileSaver from 'file-saver'
import consts from 'consts/consts';
import AccountPrivateKeyModal from "src/components/wallet/account/account-private-key-modal"
import Layout from "src/components/layout/layout"
import Account from "src/components/wallet/account/account"

export default {

    components: {AccountIdenticon, AccountPrivateKeyModal, Layout, Account},

    data(){
        return {
            showPublicKey: false,
            showPublicKeyHash: false,
        }
    },

    methods:{

        async downloadAddress(){

            const address = await global.apacache.wallet.manager.getWalletAddressByAddress( this.address.address );
            if (!address) return false;

            const json = address.toJSON();

            let addressFile = new Blob([JSON.stringify(json)], {type: "application/json;charset=utf-8"});
            let fileName = consts.name + "_" +this.address.name + " "+this.address.address + ".wallet";
            FileSaver.saveAs(addressFile, fileName);

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

            this.$store.commit('setIsLoading', true);


            try{

                const out = await global.apacache.wallet.manager.deleteWalletAddressByAddress( this.address.address );
                if (out)
                    this.$notify({
                        type: 'success',
                        title: `Address ${this.address.name} has been removed successfully`,
                        text: `The address ${this.address.address} has been removed and deleted from your wallet`,
                    });

            }catch(err){

            }


            this.$store.commit('setIsLoading', false);

        },

        copyAddress(key){

            this.$copyText(key).then( (e) => {
                this.$notify({
                    type: 'success',
                    title: `Copied to clipboard successfully`,
                    text: `${key} copied to clipboard`,
                });
            }, (e) => {
                this.$notify({
                    type: 'error',
                    title: `Clipboard failed`,
                    text: `Failed to copy to clipboard`,
                });
            })

        }

    },

    computed:{

        address(){
            return this.$store.state.wallet.addresses[this.$store.state.wallet.mainAddress] ;
        }

    },

}
</script>

<style scoped>

    .account-info{
        text-align: left;
    }

    .buttons .btn-round{
        display: inline-block;
    }

    .buttons-row .btn{
        display: inline-block;
        text-align: center;
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