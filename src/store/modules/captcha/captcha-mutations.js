import Vue from 'vue'

export default {

    setCaptcha:  (state, captcha ) => {
        state.captcha = captcha;
    },

    setCaptchaLoading:  (state, captchaLoading ) => {
        state.captchaLoading = captchaLoading;
    },

    setCaptchaUserInput: (state, userInput)=>{
        state.captchaUserInput = userInput;
    }
}