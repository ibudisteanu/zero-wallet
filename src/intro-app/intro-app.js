import * as Vue from 'vue'
import Loading from './intro';


export default (params) => {

    const app = window.PandoraPayWalletIntro = Vue.createApp({

        render () {

            return Vue.h( Loading, {
                props: {
                    startAutomatically: params.startAutomatically,
                }
            });

        }

    });

    app.mount('#wallet-loading')

    return app
}
