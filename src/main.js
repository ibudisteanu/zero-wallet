class Main {

    constructor(){

        if (!global.PandoraPayWalletOptions){
            global.PandoraPayWalletOptions = {}
        }

        global.PandoraPayWalletOptions.wallet = {
            activated: true,
            style: "dark",
            id: "Wallet",
        };

        /**
         * On Window Load
         */

        console.log("User-Interface-Loaded");
        //this.loadMain();

        if (global.PandoraPayWalletOptions){
            this.start()
        }

    }

    start(){

    }

    _loadMain(){
        const mainVue = require('./main/main-vue').default;
        mainVue(global.PandoraPayWalletOptions.wallet);
    }

}

const main = new Main();

if ( typeof window !== 'undefined')
    window.PandoraPayWallet = main;

export default main;
