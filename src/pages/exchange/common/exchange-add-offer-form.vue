<template>

    <div>

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
            <span class="disabled">Offer Accepted Payments</span> <br/>
            <input type="text" v-model="title">
        </div>

        <div class="pd-top-20">
            <input type="submit" value="Create Offer" @click="createForm">
        </div>

    </div>

</template>

<script>
import AccountIdenticon from "src/components/wallet/account/account-identicon";
import Consensus from "src/consensus/consensus"

export default {

    components: {AccountIdenticon},

    data(){
        return {
            address: '',
            title: '',
            description: '',
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

        createForm(){

        }

    },

    async mounted(){
        await Consensus.initPromise;

        this.address = this.mainAddress;

    }

}
</script>

<style scoped>

    .address-row{
        display: grid;
        grid-template-columns: 50px 1fr;
        grid-column-gap: 10px;
    }

</style>