<template>
    <modal ref="modal" title="Send Funds Anonymously" >

        <span class="disabled">Destination Address</span> <br/>

        <div class="destination-row">

            <account-identicon :identicon="destinationAddressIdenticon" size="35" outer-size="35" />

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

    </modal>
</template>

<script>
import Modal from "src/components/utils/modal"
import Account from "./../account/account"
import AccountIdenticon from "../account/account-identicon";
import QrCodeScanner from "../send/qr-code-scanner/qr-code-scanner";

export default {

    components: {AccountIdenticon, Modal, Account, QrCodeScanner },

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

        showModal(){
            this.$refs.modal.showModal();
        },

        closeModal(){
            this.$refs.modal.closeModal();
        },

        sendMoney(){

        },

        qrCodeScanner(){
            this.$refs.refQRCodeScannerModal.showModal();
        },

    },

    computed:{

        address(){
            return this.$store.state.addresses[this.$store.state.mainAddress] ;
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
    }

    .fee-row{
        display: grid;
        grid-template-columns: 40px 1fr 40px;
    }

    .fee-row span{
        display: flex;
        justify-content: center; /* align horizontal */
        align-items: center; /* align vertical */
    }

</style>