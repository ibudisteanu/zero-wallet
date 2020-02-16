<template>

    <modal ref="modal" title="Captcha">
        <span>To avoid spam, captcha is required to avoid robots</span>
        <captcha @submit="captchaSubmit" ref="refCaptcha" />
    </modal>

</template>

<script>
import Modal from "./../modal.vue"
import Captcha from "./captcha";
export default {
    components: {Captcha, Modal},
    data(){
        return {
            onSubmit: null,
            error: '',
        };
    },

    methods: {
        showModal(onSubmit ){
            this.onSubmit = onSubmit;
            this.error = '';
            this.$refs['modal'].showModal(undefined,);
        },
        closeModal(){
            this.$refs['modal'].closeModal();
        },
        captchaSubmit(resolve, captcha ){
            this.onSubmit( resolve, captcha);
        },
        reset(){
            this.$refs['refCaptcha'].reset();
        },
        processError(error){

            return this.$refs['refCaptcha'].processError(error);

        }
    }
}
</script>

<style scoped>

    .captcha-box{
        margin-top: 20px;
    }

</style>