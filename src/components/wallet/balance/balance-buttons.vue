<template>

    <div class="buttons-row pd-top-20">
        <div class="btn">
            <div class="btn-round" v-tooltip.bottom="'Send Money'" >
                <i class="fa fa-long-arrow-down"></i>
            </div>
        </div>

        <div class="btn">
            <div class="btn-round" v-tooltip.bottom="'Receive Money'" >
                <i class="fa fa-long-arrow-up"></i>
            </div>
        </div>
        <div class="btn">
            <div class="btn-round"  v-tooltip.bottom="'Scan QR Code'">
                <i class="fa fa-qrcode"></i>
            </div>
        </div>
        <div class="btn">
            <div class="btn-round" @click="openAccountInfoModal" v-tooltip.bottom="'View Account Info'" >
                <i class="fa fa-info"></i>
            </div>
        </div>
        <div class="btn" v-if="!encrypted">
            <div class="btn-round" @click="setPassword" v-tooltip.bottom="'Set Password'" >
                <i class="fa fa-unlock-alt"></i>
            </div>
        </div>

        <div class="btn" v-if="encrypted">
            <div class="btn-round" @click="removePassword" v-tooltip.bottom="'Remove Password'" >
                <i class="fa fa-lock"></i>
            </div>
        </div>

        <account-info-modal ref="refAccountInfoModal"/>

    </div>

</template>

<script>
import AccountInfoModal from "./../account/account-info.modal"


export default {

    components: {AccountInfoModal},

    computed:{
        encrypted(){
            return this.$store.state.encrypted;
        }
    },

    methods:{

        openAccountInfoModal(){
            this.$refs.refAccountInfoModal.showModal();
        },

        setPassword(){

        },

        removePassword(){

        },

    }

}
</script>

<style scoped>

    .buttons-row{
        text-align: center;
    }

    .buttons-row .btn{
        display: inline-block;
        text-align: center;
    }

    .btn-round{

    }



</style>