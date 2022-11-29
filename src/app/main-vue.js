// Import Vue
import * as Vue from 'vue'
import App from './app';
import store from "../store/store";
import router from "../router/router.index"

import VueClipboard from 'vue-clipboard2'
import VueTooltip from "v-tooltip"
import VueTooltipCss from "v-tooltip/dist/v-tooltip.css"
import Decimal from "decimal.js"
import JSONParse from "../utils/custom-json/json-parse";
import StringHelper from "../utils/string-helper";
import ValidatorHelper from "../utils/validator-helper";
import UtilsHelper from "../utils/utils-helper";

export default (options) => {

    const app = Vue.createApp({
        render () {
            return Vue.h(App, {
                options,
            });
        }
    });

    app.config.globalProperties.$validator = ValidatorHelper
    app.config.globalProperties.$strings = StringHelper
    app.config.globalProperties.$utils = UtilsHelper

    app.config.globalProperties.PandoraPay = PandoraPay

    app.config.globalProperties.Decimal = Decimal
    app.config.globalProperties.Decimal_0 = new Decimal(0)
    app.config.globalProperties.Decimal_1 = new Decimal(1)
    app.config.globalProperties.Decimal_2 = new Decimal(2)
    app.config.globalProperties.Decimal_10 = new Decimal(10)

    app.config.globalProperties.Buffer = Buffer

    app.config.globalProperties.JSONStringify = JSONStringify
    app.config.globalProperties.JSONParse = JSONParse

    store.commit('createSyncPromise')
    store.commit('setScreenInformation')
    store.commit('readLocalStorage')

    window.addEventListener('resize', function(event) {
        store.commit('setScreenInformation')
    })

    app.use(store);
    app.use(router);
    app.use(VueClipboard);
    app.use(VueTooltip)

    app.mount( options.wallet.appId )

    window.PandoraPayWalletApp = app;

    return app

}

