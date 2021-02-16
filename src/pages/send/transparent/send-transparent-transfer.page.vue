<template>

    <layout>

        <div v-if="address">

            <send-top-bar v-if="address.type === WalletAddressTypeEnum.WALLET_ADDRESS_TRANSPARENT " />

            <div class="container pd-top-20">
                <div class="boxed ">

                    <h1>Send Transparent Funds</h1>

                    <loading-spinner v-if="!address.loaded" />

                    <div v-if="address.loaded">

                        <destination-address v-for="(destination, index) in destinations"
                                             :key="`destinationAddress-${index}`"
                                             :index="index"
                                             :type="WalletAddressTypeEnum.WALLET_ADDRESS_TRANSPARENT"
                                             :balances="balances" @changed="e => changedDestination(index, e)">
                        </destination-address>

                        <div class="right">
                            <button class="addMore" @click="addDestination">
                                <i class="fa fa-plus"></i>
                                Add another destination
                            </button>
                        </div>

                        <extra-message :destinations="destinations"
                                       :type="WalletAddressTypeEnum.WALLET_ADDRESS_TRANSPARENT"
                                       @changed="changedExtra" />

                        <destination-amount text="Fee" :balances="balances" @changed="changedFee" />

                        <span v-if="error" class="danger">
                            {{error}}
                        </span>

                        <div class="centered pd-top-20">
                            <loading-button text="Send Money Publicly" @submit="handleSendFunds" icon="fa fa-money-bill-alt" />
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

const {TxTokenCurrencyTypeEnum} = PandoraLibrary.transactions;
const {WalletAddressTypeEnum} = PandoraLibrary.blockchain.wallet;

import LoadingSpinner from "src/components/utils/loading-spinner";
import LoadingButton from "src/components/utils/loading-button.vue"

import SendTopBar from "../send-top-bar.vue"

import DestinationAddress from "src/components/send/destination-address.vue"
import DestinationAmount from "src/components/send/destination-amount.vue"
import ExtraMessage from "src/components/send/extra-message"
import Vue from 'vue'

export default {

    components: {Layout, Account, LoadingSpinner, LoadingButton, SendTopBar, DestinationAddress, DestinationAmount, ExtraMessage },

    data(){
        return {

            destinations: [],
            fee: 0,
            feeTokenCurrency: '',

            extraMessage: '',
            extraEncryptionOption: '',

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
                address: null,
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

        changedExtra(data){
            if (data.extraMessage !== undefined) this.extraMessage = data.extraMessage;
            if (data.extraEncryptionOption) this.extraEncryptionOption = data.extraEncryptionOption;
        },

        async handleSendFunds(resolve){

            try{

                this.error = '';

                for (const destination of this.destinations) {
                    if (destination.address === this.address.address)
                        throw Error("Destination can not be the same with from");

                    if (destination.validationError)
                        throw Error(destination.validationError);
                }

                const nonce = await Consensus.downloadNonceIncludingMemPool( this.address.address );
                if (nonce === undefined) throw Error("The connection to the node was dropped");

                //compute extra
                const out = await PandoraPay.wallet.transfer.transferSimple({
                    address: this.address.address,
                    txDsts: this.destinations.map( it => ({
                        address: it.address,
                        amount: it.amount,
                        tokenCurrency: it.tokenCurrency,
                    })),
                    fee: this.fee,
                    feeTokenCurrency: this.feeTokenCurrency,
                    extra:{
                        extraMessage: this.extraMessage,
                        extraEncryptionOption: this.extraEncryptionOption,
                    },
                    nonce,
                    memPoolValidateTxData: false,
                });


                if (!out) throw Error("Transaction couldn't be made");

                const outConsensus = await Consensus._client.emitAsync("mem-pool/new-tx", {tx: out.tx.toBuffer() }, 0);
                if (!outConsensus)
                    throw Error("Transaction was not included in MemPool");

                Consensus.includeTransactionToPending(out.tx);

                const hash = out.tx.hash().toString("hex");

                this.$notify({
                    type: 'success',
                    title: `Transaction created`,
                    text: `A transaction has been made. \n TxId <strong>${hash}</strong>`,
                });

                this.$router.push(`/explorer/tx/hash/${hash}`);

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