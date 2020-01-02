// Import Vue
import Vue from 'vue';

// Import Vue App, routes, store
import App from './app';

import store from "./store/store";

import Notification from 'vue-notification';

import VTooltip from 'v-tooltip'

import router from "./router/router.index"

Vue.use(VTooltip);
Vue.use(Notification);

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