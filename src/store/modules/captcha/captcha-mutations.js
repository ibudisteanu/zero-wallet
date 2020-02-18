import Vue from 'vue'

export default {

    setCaptcha:  (state, captcha ) => {

        if (typeof captcha.data !== "string" || captcha.data.indexOf("data:image/gif;base64,") !== 0)
            throw "Image is not base64";

        captcha.expireDate = new Date().getTime() / 1000 + captcha.expire;
        state.captcha = captcha;

    },

    setCaptchaLoading:  (state, captchaLoading ) => {
        state.captchaLoading = captchaLoading;
    },

    setCaptchaUserInput: (state, userInput)=>{
        state.captchaUserInput = userInput;
    }
}