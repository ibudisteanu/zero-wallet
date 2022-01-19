import JSONParse from 'src/utils/custom-json/json-parse'
import  JSONStringify from 'src/utils/custom-json/json-stringify'

class Main {

    constructor(){

        const decoder = new TextDecoder("utf-8")
        const encoder = new TextEncoder("utf-8")

        global.MyTextDecode = (a)=> a ? decoder.decode(a) : null
        global.MyTextEncode = (a)=> a ? encoder.encode(a) : null

        global.JSONStringify = JSONStringify
        global.JSONParse = JSONParse

        window.addEventListener("load", () => {
            this.initialize()
        } );

    }

    initialize(){

        if (!PandoraPayWalletOptions)
            global.PandoraPayWalletOptions = {}

        if (!PandoraPayWalletOptions.router)
            PandoraPayWalletOptions.router = {}

        if (typeof PandoraPayWalletOptions.resPrefix === "undefined")
            PandoraPayWalletOptions.resPrefix = '/'

        if (!PandoraPayWalletOptions.wallet)
            global.PandoraPayWalletOptions.wallet = {
                activated: true,
                style: "dark",
                id: "Wallet",
            }

        if (!PandoraPayWalletOptions.intro)
            global.PandoraPayWalletOptions.intro = { }

        /**
         * On Window Load
         */

        this.start()

    }

    start(){
        const introAppVue = require('./intro-app/intro-app').default;
        this.introAppVue = introAppVue(PandoraPayWalletOptions.intro);
    }

    loadWallet(){

        if (this.introAppVue){
            this.introAppVue.$destroy()
            const elem = document.getElementById("pandora-wallet-intro");
            document.getElementById("pandora-wallet-intro").parentNode.removeChild(elem);
        }

        const mainVue = require('./wallet-app/main-vue').default;
        this.walletVueApp = mainVue(PandoraPayWalletOptions.wallet);
    }

}

const main = new Main();

if ( typeof window !== 'undefined')
    window.PandoraPayWallet = main;

export default main;
