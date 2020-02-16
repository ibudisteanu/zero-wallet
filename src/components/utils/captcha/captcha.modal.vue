<template>

    <modal ref="modal" title="Captcha">
        <span>To avoid spam, captcha is required to avoid robots</span>
        <captcha style="margin-top: 20px" @submit="captchaSubmit" ref="refCaptcha" />
        <span class="danger">{{error}}</span>
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

            if (error === "Captcha expired" || error === "Captcha was already used"  || error === "Captcha is incorrect") {

                this.$refs['refCaptcha'].processError(error);

                this.error = error;
                return error;
            }

            return '';
        }
    }
}
</script>

<style scoped>
</style>