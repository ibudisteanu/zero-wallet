<template>

    <div class="pd-top-20">

        <div class="buttons-row">
            <div class="btn">
                <div class="btn-round" @click="send" v-tooltip.bottom="'Send Money'" >
                    <i class="fa fa-long-arrow-down"></i>
                </div>
            </div>

            <div class="btn">
                <div class="btn-round" @click="receive" v-tooltip.bottom="'Receive Money'" >
                    <i class="fa fa-long-arrow-up"></i>
                </div>
            </div>
            <div class="btn">
                <div class="btn-round" @click="qrCodeScanner" v-tooltip.bottom="'Scan QR Code'">
                    <i class="fa fa-qrcode"></i>
                </div>
            </div>
        </div>

        <div class="buttons-row">
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
        </div>

        <account-info-modal ref="refAccountInfoModal"/>
        <set-password-modal ref="refSetPasswordModal" />
        <remove-password-modal ref="refRemovePasswordModal" />
        <receive-modal ref="refReceiveModal" />
        <qr-code-scanner ref="refQRCodeScannerModal"/>
        <send-modal ref="refSendModal" />

    </div>

</template>

<script>
import AccountInfoModal from "./../account/account-info.modal"
import SetPasswordModal from "./../encryption/set-password.modal"
import RemovePasswordModal from "./../encryption/remove-password.modal"
import ReceiveModal from "./../receive/receive.modal"
import QrCodeScanner from "../send/qr-code-scanner/qr-code-scanner";
import SendModal from "../send/send.modal"

export default {

    components: { QrCodeScanner, AccountInfoModal, SetPasswordModal, RemovePasswordModal, ReceiveModal, SendModal },

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
            this.$refs.refSetPasswordModal.showModal();
        },

        removePassword(){
            this.$refs.refRemovePasswordModal.showModal();
        },

        receive(){
            this.$refs.refReceiveModal.showModal();
        },

        qrCodeScanner(){
            this.$refs.refQRCodeScannerModal.showModal();
        },

        send(){
            this.$refs.refSendModal.showModal();
        }

    }

}
</script>

<style scoped>

    .buttons-row{
        display: inline-block;
    }

    .buttons-row:first-child{
    }

    .buttons-row:last-child{
    }

    .buttons-row .btn{
        display: inline-block;
        text-align: center;
    }

    .btn-round{

    }



</style>