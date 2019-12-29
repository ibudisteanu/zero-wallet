<template>

    <modal ref="modal" :title="`Info:  ${ address.name }`" >

        <div class="account-info">
            <account-identicon :identicon="address.identicon" :size="60" :outer-size="70" />

            <div>
                <span class="disabled">Name</span> <span>{{address.name}} </span><br/>
                <span class="disabled">Address</span> <span>{{address.address}}</span> <br/>
            </div>
        </div>

    </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import AccountIdenticon from "./account-identicon";
export default {

    components: {AccountIdenticon, Modal},

    methods:{

        showModal(){
            this.$refs.modal.showModal();
        },

        closeModal(){
            this.$refs.modal.closeModal();
        },

    },

    computed:{

        address(){
            return this.$store.state.addresses[this.$store.state.mainAddress] ;
        }

    },

}
</script>

<style scoped>

    .account-info{
        display: grid;
        grid-template-columns: 100px 1fr;
        text-align: left;
    }


</style>