<template>

    <layout>
        <div class="container pd-top-40">
            <div class="boxed ">

                <h1>Send Funds Publicly</h1>

                <loading-spinner v-if="!address.loaded" />

                <div v-if="address.loaded">

                    <span class="disabled">Destination Address</span> <br/>

                    <div :class="`${destinationAddressIdenticon ? 'destination': ''}-row`">

                        <account-identicon v-if="destinationAddressIdenticon" :identicon="destinationAddressIdenticon" size="35" outer-size="8" />

                        <div class="input-toggle-group">
                            <input type="text" v-model="destinationAddress">
                            <i class="fa fa-qrcode input-toggle" @click="qrCodeScanner"></i>
                        </div>

                    </div>

                    <div class="pd-top-20">
                        <div class="amount-row">
                            <div>
                                <span class="disabled">Amount</span> <br/>
                                <input type="number" v-model="amount" min="0">
                            </div>
                            <div>
                                <span class="disabled">Currency</span> <br/>
                                <select v-model="tokenCurrency">
                                    <option v-for="(balance, token) in balances"
                                            :value="token">
                                        {{token}}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="fee-row">
                        <span class="disabled">Fee</span>
                        <input type="number" v-model="fee" min="0">
                        <span class="disabled">{{tokenCurrency}}</span>
                    </div>


                    <div v-if="error || validation" class="danger centered">
                        {{validation}}
                        {{error}}
                    </div>

                    <div class="pd-top-20">
                        <input type="submit" value="Send Money Publicly" :disabled=" !destinationAddress  || !!validation " @click="sendMoney">
                    </div>

                    <qr-code-scanner ref="refQRCodeScannerModal"/>

                </div>

            </div>

        </div>

    </layout>
</template>

<script>

import Layout from "src/components/layout/layout"
import Account from "src/components/wallet/account/account"
import AccountIdenticon from "src/components/wallet/account/account-identicon";
import QrCodeScanner from "./qr-code-scanner/qr-code-scanner";
import Consensus from "src/consensus/consensus"

const {TransactionTokenCurrencyTypeEnum} = global.cryptography.transactions;
import LoadingSpinner from "src/components/utils/loading-spinner";

export default {

    components: {Layout, AccountIdenticon, Account, QrCodeScanner, LoadingSpinner },

    data(){
        return {

            destinationAddress: '',
            amount: 0,
            fee: 0,
            tokenCurrency: '00',
            paymentId: '',

            error: '',
        }
    },

    methods:{

        async sendMoney(){

            this.error = '';

            try{

                if (this.address.address === this.destinationAddress) throw {message: "Destination can not be the same with from"};

                const amount = global.apacache._scope.argv.transactions.coins.convertToUnits( Number.parseInt(this.amount) );
                const fee = global.apacache._scope.argv.transactions.coins.convertToUnits( Number.parseInt(this.fee) );

                const nonce = await Consensus.downloadNonceIncludingMemPool( this.address.address );
                if (nonce === undefined) throw {message: "The connection to the node was dropped"};

                console.log("nonce", nonce);

                const out = await global.apacache.wallet.transfer.transferSimple({
                    address: this.address.address,
                    txDsts: [{
                        address: this.destinationAddress,
                        amount,
                    }],
                    fee,
                    paymentId: this.paymentId,
                    tokenCurrency: this.tokenCurrency,
                    nonce,
                    memPoolValidateTxData: false,
                });

                if (!out) throw {message: "Transaction couldn't be made"};

                const outConsensus = await Consensus._client.emitAsync("mem-pool/new-tx", {tx: out.tx.toBuffer() }, 0);
                if (!outConsensus) throw {message: "Transaction was not included in MemPool"};

                await Consensus.downloadAccountTransactions(this.address.address);

                this.$notify({
                    type: 'success',
                    title: `Transaction created`,
                    text: `A transaction has been made. \n TxId ${out.tx.hash().toString("hex")}`,
                });

                this.$router.push('/');

            }catch(err){
                this.error = err.message;
            }

        },

        qrCodeScanner(){
            this.$refs.refQRCodeScannerModal.showModal();
        },

    },

    computed:{

        balances(){
            return this.address.balances || {"00": 0};
        },

        address(){
            return this.$store.state.addresses.list[this.$store.state.wallet.mainAddress] ;
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

        },

        availableTokens(){

        }

    },

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

    .fee-row{
        display: grid;
        grid-template-columns: 40px 1fr 200px;
        grid-column-gap: 10px;
    }

    .fee-row span{
        display: flex;
        justify-content: center; /* align horizontal */
        align-items: center; /* align vertical */
    }

</style>