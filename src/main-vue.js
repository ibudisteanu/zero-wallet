// Import Vue
import Vue from 'vue';

// Import Vue App, routes, store
import App from './app';

import store from "./store/store";

import Notification from 'vue-notification';

import VTooltip from 'v-tooltip'

import router from "./router/router.index"
import VueClipboard from 'vue-clipboard2'
Vue.use(VTooltip);
Vue.use(Notification);
Vue.use(VueClipboard);

import Consensus from "src/consensus/consensus"

export default (params)=> {

    new Vue({
        el: '#app',
        store,
        router,
        render: (createElement) => {

            const app = createElement(App, {
                props: {
                    startAutomatically: params.startAutomatically,
                }
            });

            return app;

        }
    }).$mount('#app');


}