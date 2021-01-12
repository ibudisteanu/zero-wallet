<template>
    <div class="account">

        <account-identicon  :identicon="address.identicon" :size="60" :outer-size="20" :type="address.type" />
        <div class="wordwrap pd-top-10">
            <span class="">{{address.name}}</span> <br/>
            <span>{{typeName}}</span> <br/>
            <div class="pd-top-20">
                Address: <br/>
                <span class=" thick">{{getAddress}} </span> <i class="fa fa-copy pointer"  @click="copyAddress(getAddress)"/> <br/> <br/>
            </div>
        </div>

    </div>
</template>

<script>

import AccountIdenticon from "../account/account-identicon";
const {WalletAddressTypeEnum} = global.blockchain.blockchain.wallet;

export default {

    components: { AccountIdenticon },

    props: {
        address: {default: null},
    },

    computed:{

        typeName(){
            if (this.address.type === WalletAddressTypeEnum.WALLET_ADDRESS_TRANSPARENT) return 'Transparent';
        },

        getAddress(){
            if (this.address.type === WalletAddressTypeEnum.WALLET_ADDRESS_TRANSPARENT) return this.address.address;

        }

    },

    methods: {
        copyAddress(address){

            this.$copyText(address).then( e =>
                this.$notify({
                    type: 'success',
                    title: `Copied to clipboard successfully`,
                    text: `Address ${address} copied to clipboard`,
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

<style>

    .account{
        display: grid;
        grid-template-columns: 100px 1fr;
        grid-column-gap: 10px;
    }

    .account span{
        display: inline-block;
    }

    .account i{
        display: inline-block;
    }

</style>