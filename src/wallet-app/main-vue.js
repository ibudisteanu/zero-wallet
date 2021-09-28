// Import Vue
import Vue from 'vue';
import App from './app';
import store from "../store/store";
import router from "../router/router.index"

import VueClipboard from 'vue-clipboard2'
import VTooltip from 'v-tooltip'

import VueObserveVisibility from 'vue-observe-visibility'

Vue.use(VTooltip);
Vue.use(VueClipboard);

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

    return app

}

