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

        <div class="row">
            <span class="disabled">Offer Payments. Select the payments you want to accept</span> <br/> <br/>

            <div class="payments">
                <div class="available">
                    <span class="disabled">Options</span> <br/>
                    <select size="6" v-model="paymentAvailable">
                        <option v-for="(paymentAvailable, index) in paymentsAvailable"
                                v-if="!paymentsAvailableMap[paymentAvailable.name]">
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
                                v-if="paymentsSelectedMap[paymentAvailable.name]">
                            {{paymentAvailable.name}}
                        </option>
                    </select>
                </div>
            </div>

        </div>

        <div class="pd-top-20">
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

    data(){
        return {
            address: '',
            title: '',
            description: '',

            paymentAvailable: '',
            paymentSelected: '',

            paymentsAvailableMap: {},
            paymentsSelectedMap: {},

            paymentsAvailable: [],
        }
    },

    computed: {

        mainAddress(){
            return this.$store.state.wallet.mainAddress;
        },

        addresses() {
            return this.$store.state.addresses.list;
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

    },

    methods:{

        handleCreateForm(){

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

    async mounted(){

        await Consensus.initPromise;

        this.address = this.mainAddress;

        const paymentsAvailable = [];
        for (const key in global.apacache._scope.availablePayments.options){
            paymentsAvailable.push( global.apacache._scope.availablePayments.options[key] );
        }

        this.paymentsAvailable = paymentsAvailable;

    }

}
</script>

<style scoped>

    .address-row{
        display: grid;
        grid-template-columns: 50px 1fr;
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