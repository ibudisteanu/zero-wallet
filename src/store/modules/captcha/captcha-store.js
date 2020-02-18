import Vuex from 'vuex'

import mutations from './captcha-mutations'

export default {
    state:  {

        captcha: null,
        captchaLoading: false,

        captchaUserInput: '',

    },
    mutations,
}