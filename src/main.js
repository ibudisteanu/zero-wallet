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
            global.PandoraPayWalletOptions.loading = { }

        /**
         * On Window Load
         */

        this.start()

    }

    start(){
        const loadingVue = require('./loading-app/loading-vue').default;
        this.loadingVueApp = loadingVue(PandoraPayWalletOptions.loading);
    }

    loadWallet(){

        if (this.loadingVueApp){
            this.loadingVueApp.$destroy()
            const elem = document.getElementById("pandora-wallet-loading");
            document.getElementById("pandora-wallet-loading").parentNode.removeChild(elem);
        }

        const mainVue = require('./wallet-app/main-vue').default;
        this.walletVueApp = mainVue(PandoraPayWalletOptions.wallet);
    }

}

const main = new Main();

if ( typeof window !== 'undefined')
    window.PandoraPayWallet = main;

export default main;
