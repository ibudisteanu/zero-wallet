<template>

    <div>
        <span class="disabled">Destination Address {{index+1}}</span> <br/>

        <div :class="`${destinationAddressIdenticon ? 'destination': ''}-row`">

            <account-identicon v-if="destinationAddressIdenticon" :identicon="destinationAddressIdenticon" size="35" outer-size="8" />

            <div class="input-toggle-group">
                <input type="text" v-model="destinationAddress">
                <i class="fa fa-qrcode input-toggle" @click="qrCodeScanner"></i>
            </div>

        </div>

        <div class="amount-row">
            <div>
                <span class="disabled">Amount</span> <br/>
                <input type="number" v-model="amount" min="0">
            </div>
            <div>
                <span class="disabled">Currency</span> <br/>
                <select v-model="tokenCurrency">
                    <option v-for="(balance, token) in balances"
                            :key="`send-money-${token}`"
                            :value="token">
                        {{getTokenName(token)}}
                    </option>
                </select>
            </div>
        </div>

    </div>


</template>

<script>

import AccountIdenticon from "src/components/wallet/account/account-identicon"


export default {

    components: {AccountIdenticon},

    data(){
        return {
            destinationAddress: '',
        }
    },

    props:{
        index: 0,
    },

    computed:{

        validation(){

            if (!this.destinationAddress) return '';

            try{

                const address = PandoraPay.cryptography.addressValidator.validateAddress( this.destinationAddress );
                if (!address) throw {message: "Invalid address"};

                return '';

            }catch(err){
                return err.message;
            }
        },

        destinationAddressIdenticon(){

            try{
                const address = PandoraPay.cryptography.addressValidator.validateAddress( this.destinationAddress );
                if (!address) throw {message: "Invalid address"};

                return address.identiconImg();

            }catch(err){

            }

        },
    },

    methods: {
        getTokenName(token){

            if (!this.$store.state.tokens.list[token]) return '';
            return this.$store.state.tokens.list[token].name;
        },

        qrCodeScanner(){
            this.$refs.refQRCodeScannerModal.showModal();
        },


    }

}
</script>

<style scoped>
    .destination-row{
        display: grid;
        grid-template-columns: 50px 1fr;
        grid-column-gap: 10px;
    }

    .amount-row{
        display: grid;
        grid-template-columns: 1fr 200px;
        grid-column-gap: 10px;
    }

</style>