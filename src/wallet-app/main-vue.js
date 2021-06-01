// Import Vue
import Vue from 'vue';
import App from './app';
import store from "../store/store";
import router from "../router/router.index"

import VueClipboard from 'vue-clipboard2'
import Notification from 'vue-notification';
import VTooltip from 'v-tooltip'

Vue.use(VTooltip);
Vue.use(Notification);
Vue.use(VueClipboard);

import Consensus from "src/consensus/consensus"

export default (params) => {

    const app = new Vue({
        el: '#wallet',
        store,
        router,
        render: (createElement) => {

            return createElement(App, {
                props: {
                    startAutomatically: params.startAutomatically,
                }
            });

        }
    }).$mount('#wallet');

    window.PandoraPayWalletApp = app;
    window.PandoraPayConsensus = Consensus;

    return app

}

