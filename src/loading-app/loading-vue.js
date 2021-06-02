import Vue from "vue";
import Loading from './loading';

import VueRouter from 'vue-router';

Vue.use(VueRouter);

export default (params) => {

    return window.PandoraPayWalletLoading = new Vue({
        el: '#wallet-loading',
        render: (createElement) => {

            return createElement( Loading, {
                props: {
                    startAutomatically: params.startAutomatically,
                }
            });

        }
    });

}
