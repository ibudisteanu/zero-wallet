import Vue from "vue";
import Loading from './loading';

import VueRouter from 'vue-router';

Vue.use(VueRouter);

export default (params) => {

    const app = new Vue({
        el: '#wallet-loading',
        render: (createElement) => {

            const app = createElement( Loading, {
                props: {
                    startAutomatically: params.startAutomatically,
                }
            });

            return app;

        }
    });

    window.PandoraPayWalletLoading = app;

}
