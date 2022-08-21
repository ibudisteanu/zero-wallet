import * as Vue from 'vue'
import Loading from './intro';


export default (params) => {

    const app = window.PandoraPayWalletIntro = Vue.createApp({

        render () {

            return Vue.h( Loading, {
                startAutomatically: params.startAutomatically,
                defaultTheme: params.defaultTheme,
            });

        }

    });

    app.mount(params.appId)

    return app
}
