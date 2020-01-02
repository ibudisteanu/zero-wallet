<template>

    <layout>
        <div class="container pd-top-40">
            <div class="boxed ">

                <h1>Send Funds Anonymously</h1>

                <span class="disabled">Destination Address</span> <br/>

                <div :class="`${destinationAddressIdenticon ? 'destination': ''}-row`">

                    <account-identicon v-if="destinationAddressIdenticon" :identicon="destinationAddressIdenticon" size="35" outer-size="35" />

                    <div class="input-toggle-group">
                        <input type="text" v-model="destinationAddress">
                        <i class="fa fa-qrcode input-toggle" @click="qrCodeScanner"></i>
                    </div>

                </div>

                <div class="pd-top-20">
                    <span class="disabled">Amount</span> <br/>
                    <div class="amount-row">
                        <input type="number" v-model="amount" min="0">
                        <select v-model="currency">
                            <option >USD</option>
                            <option >EUR</option>
                            <option >BTC</option>
                            <option >ETH</option>
                        </select>
                    </div>
                </div>

                <div class="fee-row">
                    <span class="disabled">Fee</span>
                    <input type="number" v-model="fee" min="0">
                    <span class="disabled">{{currency}}</span>
                </div>


                <div v-if="error || validation" class="danger centered">
                    {{validation}}
                    {{error}}
                </div>

                <div class="pd-top-20">
                    <input type="submit" value="Send Money Anonymously" :disabled="destinationAddress.length === 0" @click="sendMoney">
                </div>

                <qr-code-scanner ref="refQRCodeScannerModal"/>

            </div>
        </div>

    </layout>
</template>

<script>

import Layout from "src/components/layout/layout"
import Account from "src/components/wallet/account/account"
import AccountIdenticon from "src/components/wallet/account/account-identicon";
import QrCodeScanner from "./qr-code-scanner/qr-code-scanner";

export default {

    components: {Layout, AccountIdenticon, Account, QrCodeScanner },

    data(){
        return {

            destinationAddress: '',
            amount: 0,
            fee: 0,
            currency: '',

            error: '',
        }
    },

    methods:{

        sendMoney(){

        },

        qrCodeScanner(){
            this.$refs.refQRCodeScannerModal.showModal();
        },

    },

    computed:{

        address(){
            return this.$store.state.wallet.addresses[this.$store.state.wallet.mainAddress] ;
        },

        validation(){

            if (!this.destinationAddress) return '';

            try{

                const address = global.apacache._scope.cryptography.addressValidator.validateAddress( this.destinationAddress );
                if (!address) throw {message: "Invalid address"};

                return '';

            }catch(err){
                return err.message;
            }
        },

        destinationAddressIdenticon(){

            try{
                const address = global.apacache._scope.cryptography.addressValidator.validateAddress( this.destinationAddress );
                if (!address) throw {message: "Invalid address"};

                return address.identiconImg();

            }catch(err){

            }

        }

    },

}

</script>

<style scoped>

    .destination-row{
        display: grid;
        grid-template-columns: 60px 1fr;
    }

    .amount-row{
        display: grid;
        grid-template-columns: 1fr 100px;
        grid-column-gap: 10px;
    }

    .fee-row{
        display: grid;
        grid-template-columns: 40px 1fr 100px;
        grid-column-gap: 10px;
    }

    .fee-row span{
        display: flex;
        justify-content: center; /* align horizontal */
        align-items: center; /* align vertical */
    }

</style>