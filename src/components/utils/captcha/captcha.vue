<template>

    <div class="captcha-box" >

        <div class="row">
            <div class="captcha col-xs-12 col-sm-6">
                <loading-spinner v-if="!captcha || captchaLoading"  />
                <template v-if="captcha && !captchaLoading">
                    <img v-if="captcha.data" :src="captcha.data" alt="captcha" />
                    <i class="fa fa-sync-alt pointer" @click="reset"/>
                </template>
            </div>

            <div class="col-xs-6 col-sm-4">
                <input  type="text" placeholder="captcha" v-model="captchaInput" :minlength="captcha ? captcha.size : 1" :maxlength="captcha ? captcha.size : 1" v-on:keyup.enter="submitForm" autocomplete="off" >
            </div>

            <div class="col-xs-6 col-sm-2">
                <loading-button text="" @submit="submit" ref="refLoadingButton" icon="fa fa-paper-plane" />
            </div>
        </div>

        <div class="row row-error">
            <span class="danger">{{error}}</span>
        </div>

    </div>

</template>

<script>
import Chat from "src/chat/chat"
import LoadingSpinner from "src/components/utils/loading-spinner";
import LoadingButton from "src/components/utils/loading-button.vue"

export default {
    components: {LoadingSpinner, LoadingButton},

    props:{
        buttonText: { default: '',}
    },
    data(){
        return {
            captchaInput: '',
            error: '',
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

        if (!this.captcha || this.captcha.expireDate >= new Date().getTime() /1000)
            this.reset();

        this.captchaInput = this.$store.state.captcha.captchaUserInput;
    },
    methods:{
        reset(){
            Chat.getCaptcha();
            this.captchaInput = '';
        },

        submit(resolve){

            if (this.captchaInput.length !== this.captcha.size){
                this.error = `Captcha is ${this.captcha.size} letters.`;
                return resolve(false);
            } else this.error = '';

            this.$emit('submit', resolve, this.captchaData() );
        },

        captchaData(){
            return {
                solution: this.captchaInput,
                encryption: this.captcha.encryption,
            }
        },

        processError(error){

            if (error === "Captcha expired" || error === "Captcha was already used"  || error === "Captcha is incorrect") {

                this.reset();

                this.error = error;
                return error;
            }

            return '';
        },

        submitForm(e){
            this.$refs['refLoadingButton'].handleClick(e);
        }

    },
    watch: {
        captchaInput: function (newValue, oldValue) {
            if (newValue !== '') this.error = '';
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
        margin-bottom: 10px;
        text-align: center;
    }
    .captcha{
    }

    input{
        width: 90%;
    }
    button{
        width: 90%;
    }

    .row-error{
        padding-top: 10px;
    }

</style>