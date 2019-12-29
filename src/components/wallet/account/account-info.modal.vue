<template>

    <modal ref="modal" :title="`${ address.name }`" >

        <div class="account-info">
            <account-identicon :identicon="address.identicon" :size="60" :outer-size="70" />

            <div>
                <span class="disabled">Name</span> <span>{{address.name}} </span><br/>
                <span class="disabled">Address</span> <span>{{address.address}}</span> <br/>

                <div class="buttons-row pd-top-30">

                    <div class="btn">
                        <div class="btn-round" @mouseover="hover('download')" @mouseleave="hover('')" @click="downloadAddress">
                            <i class="fa fa-download"></i>
                        </div>
                        <span > {{hovered !== 'download' ? '&nbsp;' : 'Download'}}</span>
                    </div>

                    <div class="btn">
                        <div class="btn-round" @mouseover="hover('delete')" @mouseleave="hover('')" @click="deleteAddress">
                            <i class="fa fa-times"></i>
                        </div>
                        <span > {{hovered !== 'delete' ? '&nbsp;' : 'Delete'}}</span>
                    </div>
                </div>
            </div>
        </div>

    </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import AccountIdenticon from "./account-identicon";
export default {

    components: {AccountIdenticon, Modal},

    data(){
        return {
            hovered: '',
        }
    },


    methods:{

        showModal(){
            this.$refs.modal.showModal();
        },

        closeModal(){
            this.$refs.modal.closeModal();
        },

        hover(which){
            this.hovered = which;
        },

        downloadAddress(){

        },

        async deleteAddress(){
            const out = await global.apacache.wallet.manager.deleteWalletAddressByAddress( this.address.address );
            this.closeModal();
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

    .account-info{
        display: grid;
        grid-template-columns: 100px 1fr;
        text-align: left;
    }

    .buttons .btn-round{
        display: inline-block;
    }

    .buttons-row .btn{
        display: inline-block;
        text-align: center;
    }


    .btn-round{
        font-size: 20px;
        width: 40px;
        height: 40px;
        margin-bottom: 10px;
        margin-right: 30px;
    }

    .btn-round i{
        margin-top: 10px;
    }



</style>