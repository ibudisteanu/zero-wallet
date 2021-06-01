class Main {

    constructor(){

        window.addEventListener("load", () => {
            this.initialize()
        } );

    }

    initialize(){

        if (!PandoraPayWalletOptions)
            global.PandoraPayWalletOptions = {}

        if (!PandoraPayWalletOptions.wallet)
            global.PandoraPayWalletOptions.wallet = {
                activated: true,
                style: "dark",
                id: "Wallet",
            }

        if (!PandoraPayWalletOptions.loading)
            global.PandoraPayWalletOptions.loading = {
            }



        /**
         * On Window Load
         */

        this.start()

    }

    start(){
        const mainVue = require('./loading-app/loading-vue').default;
        mainVue(PandoraPayWalletOptions.loading);
    }

    _loadMain(){
        const mainVue = require('./wallet-app/main-vue').default;
        mainVue(PandoraPayWalletOptions.wallet);
    }

}

const main = new Main();

if ( typeof window !== 'undefined')
    window.PandoraPayWallet = main;

export default main;
