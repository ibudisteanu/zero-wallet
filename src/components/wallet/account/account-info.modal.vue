<template>

    <modal v-if="address" ref="modal" :title="`${ address.name }`" >

        <div class="account-info">
            <account-identicon :identicon="address.identicon" :size="60" :outer-size="70" />

            <div>
                <span class="disabled">Name</span> <span>{{address.name}} </span><br/>
                <span class="disabled">Address</span> <span>{{address.address}}</span> <br/>

                <div class="buttons-row pd-top-30">

                    <div class="btn">
                        <div class="btn-round" @click="downloadAddress" v-tooltip.bottom="'Download Account'" >
                            <i class="fa fa-download"></i>
                        </div>
                    </div>

                    <div class="btn">
                        <div class="btn-round" @click="deleteAddress" v-tooltip.bottom="'Delete'" >
                            <i class="danger fa fa-times"></i>
                        </div>
                    </div>

                    <div class="btn">
                        <div class="btn-round" @click="showPrivateKey" v-tooltip.bottom="'View Private Key'" >
                            <i class="fa fa-eye"></i>
                        </div>
                    </div>

                </div>

            </div>
        </div>

        <account-private-key-modal ref="refAccountPrivateKeyModal"/>

    </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import AccountIdenticon from "./account-identicon";
import FileSaver from 'file-saver'
import consts from 'consts/consts';
import AccountPrivateKeyModal from "./account-private-key-modal"

export default {

    components: {AccountIdenticon, Modal, AccountPrivateKeyModal},

    data(){
        return {

        }
    },

    methods:{

        showModal(){
            Object.assign(this.$data, this.$options.data());
            this.$refs.modal.showModal();
        },

        closeModal(){
            this.$refs.modal.closeModal();
        },

        async downloadAddress(){

            const address = await global.apacache.wallet.manager.getWalletAddressByAddress( this.address.address );
            if (!address) return false;

            const json = address.toJSON();

            let addressFile = new Blob([JSON.stringify(json)], {type: "application/json;charset=utf-8"});
            let fileName = consts.name + "_" +this.address.name + " "+this.address.address + ".wallet";
            FileSaver.saveAs(addressFile, fileName);

            this.$notify({
                type: 'success',
                title: `Address ${this.address.name} has been saved in your machine`,
                text: `The address ${this.address.address} has been saved in the downloads folder.`,
            });


        },

        showPrivateKey(){

            this.$refs.refAccountPrivateKeyModal.showModal(this.address);

        },

        async deleteAddress(){

            this.$store.commit('setIsLoading', true);


            try{

                const confirmation = confirm( `Are you sure you want to Delete ${this.address.name} ${ this.address.address } `);
                if (!confirmation) return;

                const out = await global.apacache.wallet.manager.deleteWalletAddressByAddress( this.address.address );
                if (out)
                    this.$notify({
                        type: 'success',
                        title: `Address ${this.address.name} has been removed successfully`,
                        text: `The address ${this.address.address} has been removed and deleted from your wallet`,
                    });


                this.closeModal();

            }catch(err){

            }


            this.$store.commit('setIsLoading', false);

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