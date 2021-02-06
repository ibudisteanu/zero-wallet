<template>

    <layout>

        <div v-if="address">

            <send-top-bar v-if="address.type === WalletAddressTypeEnum.WALLET_ADDRESS_TRANSPARENT " />

            <div class="container pd-top-20">
                <div class="boxed ">

                    <h1>Send Funds Publicly</h1>

                    <loading-spinner v-if="!address.loaded" />

                    <div v-if="address.loaded">

                        <destination-address v-for="(destination, index) in destinations"
                                             :key="`destinationAddress-${index}`"
                                             :index="index"
                                             :type="WalletAddressTypeEnum.WALLET_ADDRESS_TRANSPARENT"
                                             :balances="balances" @changed="e => changedDestination(index, e)">
                        </destination-address>

                        <div class="centered">
                            <button class="addMore" @click="addDestination">
                                <i class="fa fa-plus"></i>
                                Add another destination
                            </button>
                        </div>

                        <destination-amount text="Fee" :balances="balances" @changed="changedFee" />

                        <div v-if="error || validation" class="danger centered">
                            {{validation}}
                            {{error}}
                        </div>

                        <div class="pd-top-20">
                            <loading-button text="Send Money Publicly" @submit="handleSendFunds" icon="fa fa-money-bill-alt"  />
                        </div>

                    </div>

                </div>

            </div>


        </div>

    </layout>
</template>

<script>

import Layout from "src/components/layout/layout"
import Account from "src/components/wallet/account/account"
import Consensus from "src/consensus/consensus"

const {TxTokenCurrencyTypeEnum} = global.cryptography.transactions;
const {WalletAddressTypeEnum} = global.blockchain.blockchain.wallet;

import LoadingSpinner from "src/components/utils/loading-spinner";
import LoadingButton from "src/components/utils/loading-button.vue"

import SendTopBar from "../send-top-bar.vue"

import DestinationAddress from "src/components/send/destination-address.vue"
import DestinationAmount from "src/components/send/destination-amount.vue"
import Vue from 'vue'

export default {

    components: {Layout, Account, LoadingSpinner, LoadingButton, SendTopBar, DestinationAddress, DestinationAmount },

    data(){
        return {

            destinations: [],
            fee: 0,
            feeTokenCurrency: '',

            paymentId: '',
            error: '',

        }
    },

    computed:{

        WalletAddressTypeEnum: () => WalletAddressTypeEnum,

        balances(){
            return this.address.balances || {"": 0};
        },

        address(){
            return this.$store.state.addresses.list[this.$store.state.wallet.mainAddress] ;
        },


    },

    methods:{

        addDestination(){

            this.destinations.push({
                destinationAddress: '',
                validationError: 'Address is empty',
                amount: 0,
                tokenCurrency: '',
            });
        },

        changedDestination(index, data){
            Vue.set(this.destinations, index, {
                ...this.destinations[index],
                ...data
            });
        },

        changedFee(data){
            if (data.amount !== undefined) this.fee = data.amount;
            if (data.tokenCurrency) this.feeTokenCurrency = data.tokenCurrency;
        },

        async handleSendFunds(resolve){

            try{

                this.error = '';

                for (const destination of this.destinations) {
                    if (destination.destinationAddress === this.address.address)
                        throw {message: "Destination can not be the same with from"};

                    if (destination.validationError)
                        throw {message: destination.validationError};
                }

                const nonce = await Consensus.downloadNonceIncludingMemPool( this.address.address );
                if (nonce === undefined) throw {message: "The connection to the node was dropped"};

                const out = await PandoraPay.wallet.transfer.transferSimple({
                    address: this.address.address,
                    txDsts: this.destinations.map( it => ({
                        address: it.destinationAddress,
                        amount: it.amount,
                        tokenCurrency: it.tokenCurrency,
                    })),
                    fee: this.fee,
                    feeTokenCurrency: this.feeTokenCurrency,
                    paymentId: this.paymentId,
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

                this.$router.push(`/explorer/tx/hash/${out.tx.hash().toString('hex')}`);

            }catch(err){
                console.error(err);
                this.error = err.message;
            }finally{
                resolve(true);
            }

        },


    },

    mounted(){
        this.addDestination();
    }

}

</script>

<style scoped>
    .addMore{
        max-width: 200px;
    }
</style>