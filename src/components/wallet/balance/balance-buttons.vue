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


        <account-info-modal ref="refAccountInfoModal"/>

    </div>

</template>

<script>
import AccountInfoModal from "./../account/account-info.modal"


export default {

    components: {AccountInfoModal},

    methods:{


        openAccountInfoModal(){
            this.$refs.refAccountInfoModal.showModal();
        }
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