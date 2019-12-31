<template>
    <modal ref="modal" title="Send Funds Anonymously" >

        <span class="disabled">Destination Address</span> <br/>
        <input type="text" v-model="inputVal">

        <div v-if="error" class="danger centered">
            {{error}}
        </div>

        <input type="submit" value="Send Money Anonymously" :disabled="address.length === 0" @click="sendMoney">

    </modal>
</template>

<script>
import Modal from "src/components/utils/modal"
import Account from "./../account/account"

export default {

    components: { Modal, Account },

    data(){
        return {
            address: '',
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
        }

    },

}

</script>

<style scoped>

</style>