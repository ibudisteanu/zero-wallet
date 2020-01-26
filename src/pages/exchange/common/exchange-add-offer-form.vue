<template>

    <div>

        <div class="row pd-bottom-20">
            <span>All the below data will be public used for trading</span>
        </div>

        <div class="row">
            <span class="disabled">Offer Trader Account</span> <br/>

            <div class="address-row">

                <account-identicon v-if="addressIdenticon" :identicon="addressIdenticon" size="35" outer-size="8" />
                <div v-else></div>

                <select v-model="address">
                    <option v-for="(address, i) in addresses" >
                        {{address.address}}
                    </option>
                </select>
            </div>
        </div>

        <div class="row">
            <span class="disabled">Offer Title</span> <br/>
            <input type="text" v-model="title" >
        </div>

        <div class="row">
            <span class="disabled">Offer Short Description</span> <br/>
            <textarea rows="4" v-model="description" />
        </div>

        <div class="amount-row">
            <div>
                <span class="disabled">Amount Min</span> <br/>
                <input type="number" v-model="amountMin" min="0">
            </div>
            <div>
                <span class="disabled">Amount Max</span> <br/>
                <input type="number" v-model="amountMax" min="0">
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

        <div class="row">
            <span class="disabled">Price in USD</span> <br/>
            <input type="number" v-model="price" min="0">
        </div>

        <div class="row pd-top-20">
            <span class="disabled">Offer Payments. Select the payments you want to accept</span> <br/> <br/>

            <div class="payments">
                <div class="available">
                    <span class="disabled">Options</span> <br/>
                    <select size="6" v-model="paymentAvailable">
                        <option v-for="(paymentAvailable, index) in paymentsAvailable"
                                v-if="!paymentsAvailableMap[paymentAvailable.name]" @dblclick="handlePaymentSelect">
                            {{paymentAvailable.name}}
                        </option>
                    </select>
                </div>
                <div class="buttons">

                    <i class="fa fa-angle-double-right pointer pd-bottom-20" @click="handlePaymentSelect"></i>

                    <i class="fa fa-arrows-alt-h pd-bottom-20" ></i>

                    <i class="fa fa-angle-double-left pointer " @click="handlePaymentUnselect"></i>

                </div>
                <div class="selected">
                    <span class="disabled">Selected</span> <br/>
                    <select size="6" v-model="paymentSelected">
                        <option v-for="(paymentAvailable, index) in paymentsAvailable"
                                v-if="paymentsSelectedMap[paymentAvailable.name]" @dblclick="handlePaymentUnselect">
                            {{paymentAvailable.name}}
                        </option>
                    </select>
                </div>
            </div>

        </div>

        <div class="pd-top-20">

            <span v-if="error" class="centered danger">
                {{error}}
            </span>

            <input type="submit" value="Create Offer" @click="handleCreateForm">
        </div>


    </div>

</template>

<script>
import AccountIdenticon from "src/components/wallet/account/account-identicon";
import Consensus from "src/consensus/consensus"
import Vue from 'vue';

export default {

    components: {AccountIdenticon},

    props: {
        type: 0
    },

    data(){
        return {
            address: '',
            title: '',
            description: '',
            amountMin: 0,
            amountMax: 0,
            tokenCurrency: '00',
            price: 0,

            paymentAvailable: '',
            paymentSelected: '',

            paymentsAvailableMap: {},
            paymentsSelectedMap: {},

            paymentsAvailable: [],
            error: '',
        }
    },

    computed: {

        addresses() {
            return this.$store.state.addresses.list;
        },

        balances(){
            if (!this.addresses[this.address]) return [];
            return this.addresses[this.address] .balances || {"00": 0};
        },

        mainAddress(){
            return this.$store.state.wallet.mainAddress;
        },

        addressIdenticon(){

            if (!this.address) return '';

            try{
                const address = global.apacache._scope.cryptography.addressValidator.validateAddress( this.address );
                if (!address) throw {message: "Invalid address"};

                return address.identiconImg();

            }catch(err){
                console.error(err);
            }

        },

        offer(){

            const offers = this.$store.state.exchange[  this.type === 0 ? 'buy' : 'sell' ].offers || {};

            for (const key in offers) {
                const offer = this.$store.state.exchange.list[key];
                if (offer && offer.address === this.address)
                    return offer;
            }

        }


    },

    methods:{

        async startDownloadingExchangeOffers() {
            await Consensus.initPromise;
            await Consensus.startDownloadingExchangeOffers();
        },

        async handleCreateForm(){

            this.error = '';

            try{

                const walletAddress = global.apacache._scope.wallet.manager.getWalletAddressByAddress( this.address, false, this.password );

                if (this.title.length < 10) throw {message: "Title too short"};
                if (this.description.length < 10) throw {message: "Description too short"};
                if (this.amountMax < this.amountMin || this.amountMax === 0) throw {message: "Amount Max needs to be greater or equal to Amount Min and non-zero"}

                const paymentsSelected = JSON.parse( JSON.stringify(this.paymentsSelectedMap) );
                const paymentsSelectedArray = Object.keys(paymentsSelected);

                if (paymentsSelectedArray.length < 1) throw {message: "No payments selected"};

                const data = {
                    publicKey: walletAddress.decryptPublicKey(),
                    type: this.type,
                    title: this.title,
                    description: this.description,
                    amountMin: this.amountMin,
                    amountMax: this.amountMax,
                    tokenCurrency: this.tokenCurrency,
                    price: this.price,
                    height: this.$store.state.blockchain.end-1,
                    payments: paymentsSelectedArray.map( it => ({
                        name: it,
                    })),
                    signature: Buffer.alloc(65),
                };

                const offer = global.apacache._scope.exchange.createExchangeOffer(data);

                offer.signOffer( walletAddress.decryptPrivateKey() );

                const outConsensus = await Consensus._client.emitAsync("exchange/new-offer", {offer: offer.toBuffer() }, 0);
                if (!outConsensus) throw {message: "Offer was not included"};

                this.$router.push('/exchange/'+( this.type === 0 ? 'buy' : 'sell'));

            }catch(err){
                this.error = err.message;
            }

        },

        handlePaymentSelect(){
            Vue.set(this.paymentsAvailableMap, this.paymentAvailable, true);
            Vue.set(this.paymentsSelectedMap, this.paymentAvailable, true);
        },

        handlePaymentUnselect(){
            Vue.delete(this.paymentsAvailableMap, this.paymentSelected);
            Vue.delete(this.paymentsSelectedMap, this.paymentSelected);
        }

    },

    watch: {

        offer(oldValue, newValue){

            if (newValue){

                if (!this.title) this.title = newValue.title;
                if (!this.description) this.description = newValue.description;
                if (!this.amountMin) this.amountMin = newValue.amountMin;
                if (!this.amountMax) this.amountMax = newValue.amountMax;
                if (!this.tokenCurrency) this.tokenCurrency = newValue.tokenCurrency;
                if (!this.price) this.price = newValue.price;

                let payments = [];
                for (const key in this.paymentsSelectedMap)
                    payments.push(key);

                if (payments.length === 0)
                    for (const payment of newValue.payments){
                        this.paymentsSelectedMap[payment.name] = true;
                        this.paymentsAvailableMap[payment.name] = true;
                    }


            }

        },

        '$route' (to, from) {
            return this.startDownloadingExchangeOffers();
        }
    },

    async mounted(){

        await Consensus.initPromise;

        this.startDownloadingExchangeOffers();

        this.address = this.mainAddress;

        const paymentsAvailable = [];
        for (const key in global.apacache._scope.exchange.availablePayments.options){
            paymentsAvailable.push( global.apacache._scope.exchange.availablePayments.options[key] );
        }

        this.paymentsAvailable = paymentsAvailable;

    },

    beforeDestroy(){
        return Consensus.stopDownloadingExchangeOffers();
    },

}
</script>

<style scoped>

    .address-row{
        display: grid;
        grid-template-columns: 50px 1fr;
        grid-column-gap: 10px;
    }

    .amount-row{
        display: grid;
        grid-template-columns: 1fr 1fr 200px;
        grid-column-gap: 10px;
    }

    .payments{
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        -ms-flex-direction: row;
        flex-direction: row;
    }

    .payments .available{
        overflow-y: auto;
        padding: 0;
        width: 50%;
    }

    .payments .buttons{
        display: -ms-flexbox;
        display: flex;
        -ms-flex-direction: column;
        flex-direction: column;
        margin: 0 10px;
    }

    .payments .selected{
        overflow-y: auto;
        padding: 0;
        width: 50%;
    }

    .payments-buttons i{
        display: block;
    }

</style>