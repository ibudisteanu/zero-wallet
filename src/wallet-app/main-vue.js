// Import Vue
import * as Vue from 'vue'
import App from './app';
import store from "../store/store";
import router from "../router/router.index"

import VueClipboard from 'vue-clipboard2'
import VueTooltip from "v-tooltip"
import VueTooltipCss from "v-tooltip/dist/v-tooltip.css"

export default (params) => {

    const app = Vue.createApp({
        render () {

            return Vue.h(App, {
                props: {
                    startAutomatically: params.startAutomatically,
                }
            });

        }
    });

    app.use(store);
    app.use(router);
    app.use(VueClipboard);
    app.use(VueTooltip)

    app.mount('#wallet')

    window.PandoraPayWalletApp = app;

    return app

}

