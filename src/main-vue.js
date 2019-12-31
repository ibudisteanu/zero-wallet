// Import Vue
import Vue from 'vue/dist/vue.min';

// Import Vue App, routes, store
import App from './app';

import store from "./store/store";

import Notification from 'vue-notification';

import VTooltip from 'v-tooltip'
Vue.use(VTooltip);

Vue.use(Notification);


export default (params)=> {

    new Vue({
        el: '#app',
        store,
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