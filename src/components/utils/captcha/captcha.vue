<template>

    <div class="captcha-box" >


        <div class="captcha">
            <loading-spinner v-if="!captcha || captchaLoading"  />
            <template v-if="captcha && !captchaLoading">
                <div v-html="captcha ? captcha.data : '...'"></div>
                <i class="fa fa-sync-alt" @click="reset"/>
            </template>
        </div>

        <input  type="text" placeholder="captcha" v-model="captchaInput" :maxlength="captcha ? captcha.size : 1" v-on:keyup.enter="submitForm" autocomplete="off" >

        <loading-button :text="buttonText || 'send'" @submit="submit" ref="refLoadingButton" icon="fa fa-paper-plane" />

    </div>

</template>

<script>
import Chat from "src/chat/chat"
import LoadingSpinner from "src/components/utils/loading-spinner";
import LoadingButton from "src/components/utils/loading-button.vue"

export default {
    components: {LoadingSpinner, LoadingButton},

    props:{
        buttonText: {
            default: '',
        }
    },
    data(){
        return {
            captchaInput: '',
        }
    },
    computed: {
        captcha() {
            return this.$store.state.captcha.captcha;
        },
        captchaLoading(){
            return this.$store.state.captcha.captchaLoading;
        },
    },
    mounted(){
        if (typeof window === "undefined") return;

        if (!this.captcha)
            this.reset();

        this.captchaInput = this.$store.state.captcha.captchaUserInput;
    },
    methods:{
        reset(){
            Chat.getCaptcha();
            this.captchaInput = '';
        },

        submit(resolve){
            this.$emit('submit', resolve, this.captchaData() );
        },

        captchaData(){
            return {
                solution: this.captchaInput,
                encryption: this.captcha.encryption,
            }
        },

        processError(error){

            if (error.indexOf("Captcha was already used") >= 0) {
                this.reset();
                error = error.replace("Captcha was already used", "Captcha was already used");
            }
            if (error.indexOf("Captcha is incorrect") >= 0 ){
                this.reset();
                error = error.replace("Captcha is incorrect", "Captcha is incorrect");
            }
            return error;
        },

        submitForm(e){
            this.$refs['refLoadingButton'].handleClick(e);
        }

    },
    watch: {
        captchaInput: function (newValue, oldValue) {
            this.$store.dispatch('setCaptchaUserInput', newValue);
        },
    }
}
</script>

<style scoped>

    .fa-spin{
        font-size: 40px;
    }

    .captcha-box{
        display: grid;
        grid-template-columns: 100px 100px 1fr;
        grid-column-gap: 10px;
        margin-bottom: 10px;
        text-align: center;
    }
    .captcha{
    }

    .reload-captcha{
        position: absolute;
        left: 13px;
        top: 38px;
    }
    .captcha-box button{
        margin-top: 0;
    }
    @media only screen and (max-width: 600px) {
        .captcha-box {
            grid-template-columns: 90px 1fr 40px;
            grid-row-gap: 5px;
        }
    }
    @media only screen and (max-width: 300px) {
        .captcha-box {
            grid-template-columns: 90px 1fr ;
            grid-row-gap: 5px;
        }
    }
</style>