// Import Vue
import * as Vue from 'vue'
import App from './app';
import store from "../store/store";
import router from "../router/router.index"

import VueClipboard from 'vue-clipboard2'
import VueTooltip from "v-tooltip"
import VueTooltipCss from "v-tooltip/dist/v-tooltip.css"
import StringHelper from "../utils/string-helper";

export default (options) => {

    const app = Vue.createApp({
        render () {
            return Vue.h(App, {
                options,
            });
        }
    });

    app.config.globalProperties.$base64ToHex = function(b) {
        return Buffer.from(b, "base64").toString("hex")
    }
    app.config.globalProperties.$base64ToString = function(b) {
        return Buffer.from(b, "base64").toString()
    }
    app.config.globalProperties.$hexToBase64 = function(b) {
        return Buffer.from(b, "hex").toString("base64")
    }
    app.config.globalProperties.$timeSince = function(a, b) {
        return StringHelper.timeSince(a, b)
    }
    app.config.globalProperties.$formatTime = function(a) {
        return StringHelper.formatTime(a)
    }
    app.config.globalProperties.$formatBytes = function(a) {
        return StringHelper.formatBytes(a)
    }
    app.config.globalProperties.$formatSize = function(a) {
        return StringHelper.formatSize(a)
    }
    app.config.globalProperties.$formatMoney = function(a, b, c) {
        return StringHelper.formatMoney(a, b, c )
    }

    store.commit('createSyncPromise')
    store.commit('setScreenInformation')
    store.commit('readLocalStorage')

    app.use(store);
    app.use(router);
    app.use(VueClipboard);
    app.use(VueTooltip)

    app.mount( options.wallet.appId )

    window.PandoraPayWalletApp = app;

    return app

}

