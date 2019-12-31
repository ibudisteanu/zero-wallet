<template>
    <modal ref="modal" title="Send Funds Anonymously" >

        <span class="disabled">Destination Address</span> <br/>

        <div class="destination">

            <account-identicon :identicon="destinationAddressIdenticon" size="35" outer-size="35" />

            <input type="text" v-model="destinationAddress">

        </div>

        <div class="pd-top-20">
            <span class="disabled">Amount</span> <br/>
            <input type="number" v-model="amount" min="0">
        </div>
        <div>
            <span class="disabled">Fee</span> <br/>
            <input type="number" v-model="fee" min="0">
        </div>


        <div v-if="error || validation" class="danger centered">
            {{validation}}
            {{error}}
        </div>

        <div class="pd-top-20">
            <input type="submit" value="Send Money Anonymously" :disabled="destinationAddress.length === 0" @click="sendMoney">
        </div>

    </modal>
</template>

<script>
import Modal from "src/components/utils/modal"
import Account from "./../account/account"
import AccountIdenticon from "../account/account-identicon";

export default {

    components: {AccountIdenticon, Modal, Account },

    data(){
        return {

            destinationAddress: '',
            amount: 0,
            fee: 0,

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

        }

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

    .destination{
        display: grid;
        grid-template-columns: 60px 1fr;
    }

</style>