<template>

    <layout>

        <div v-if="address">

            <send-transparent-top-bar v-if="address.type === WalletAddressTypeEnum.WALLET_ADDRESS_TRANSPARENT " />
            <send-zether-top-bar v-if="address.type === WalletAddressTypeEnum.WALLET_ADDRESS_ZETHER" />

            <div class="container pd-top-20">
                <div class="boxed ">

                    <h1>Send Funds Publicly</h1>

                    <loading-spinner v-if="!address.loaded" />

                    <div v-if="!address.loaded">

                        <destination-address v-for="(destination, index) in destinations"
                                             :index="index">
                        </destination-address>

                        <button @click="addDestination">
                            <i class="fa fa-plus"></i>
                            Add another destination
                        </button>

                        <div class="fee-row">
                            <span class="disabled">Fee</span>
                            <input type="number" v-model="fee" min="0">
                            <span class="disabled">{{getTokenName(tokenCurrency)}}</span>
                        </div>


                        <div v-if="error || validation" class="danger centered">
                            {{validation}}
                            {{error}}
                        </div>

                        <div class="pd-top-20">
                            <loading-button text="Send Money Publicly" @submit="handleSendMoney" icon="fa fa-money-bill-alt"  :disabled="!destinationIdenticon  || !!validation" />
                        </div>

                        <qr-code-scanner ref="refQRCodeScannerModal"/>

                    </div>

                </div>

            </div>


        </div>

    </layout>
</template>

<script>

import Layout from "src/components/layout/layout"
import Account from "src/components/wallet/account/account"
import QrCodeScanner from "src/components/utils/qr-code-scanner/qr-code-scanner";
import Consensus from "src/consensus/consensus"

const {TransactionTokenCurrencyTypeEnum} = global.cryptography.transactions;
const {WalletAddressTypeEnum} = global.blockchain.blockchain.wallet;

import LoadingSpinner from "src/components/utils/loading-spinner";
import LoadingButton from "src/components/utils/loading-button.vue"

import SendTransparentTopBar from "./common/send-transparent-top-bar.vue"
import SendZetherTopBar from "./common/send-zether-top-bar.vue"

import DestinationAddress from "./common/destination-address.vue"

export default {

    components: {Layout, Account, QrCodeScanner, LoadingSpinner, LoadingButton, SendTransparentTopBar, SendZetherTopBar, DestinationAddress },

    data(){
        return {

            destinations: [],

            amount: 0,
            fee: 0,
            tokenCurrency: '00',
            paymentId: '',

            error: '',
        }
    },

    computed:{

        WalletAddressTypeEnum(){
            return WalletAddressTypeEnum;
        },

        balances(){
            return this.address.balances || {"00": 0};
        },

        address(){
            return this.$store.state.addresses.list[this.$store.state.wallet.mainAddress] ;
        },

    },

    methods:{

        addDestination(){
            this.destinations.push('');
        },

        async handleSendMoney(resolve){

            try{

                this.error = '';

                if (this.address.address === this.destinationAddress) throw {message: "Destination can not be the same with from"};

                const amount = PandoraPay.argv.transactions.coins.convertToUnits( Number.parseInt(this.amount) );
                const fee = PandoraPay.argv.transactions.coins.convertToUnits( Number.parseInt(this.fee) );

                const nonce = await Consensus.downloadNonceIncludingMemPool( this.address.address );
                if (nonce === undefined) throw {message: "The connection to the node was dropped"};

                const out = await PandoraPay.wallet.transfer.transferSimple({
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