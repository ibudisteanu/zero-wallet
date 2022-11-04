import JSONParse from 'src/utils/custom-json/json-parse'
import  JSONStringify from 'src/utils/custom-json/json-stringify'
import Decimal from "decimal.js";

class Main {

    constructor(){

        const decoder = new TextDecoder("utf-8")
        const encoder = new TextEncoder("utf-8")

        global.MyTextDecode = a => a ? decoder.decode(a) : null
        global.MyTextEncode = a => a ? encoder.encode(a) : null

        global.JSONStringify = JSONStringify
        global.JSONParse = JSONParse

        global.Buffer = Buffer
        global.Decimal = Decimal
        global.Decimal_0 = new Decimal(0)
        global.Decimal_1 = new Decimal(1)
        global.Decimal_2 = new Decimal(2)
        global.Decimal_10 = new Decimal(10)

        window.addEventListener("load", () => {
            this.initialize()
        } );

    }

    initialize(){

        if (typeof PandoraPayWalletOptions === "undefined") global.PandoraPayWalletOptions = {}

        const options = PandoraPayWalletOptions

        if (!options.router) options.router = {}
        if (typeof options.resPrefix === "undefined") options.resPrefix = '/'

        options.wallet = {
            appId: '#wallet',
            startAutomatically: true,
            ...(options.wallet||{}),
        }

        options.intro = {
            appId: '#wallet-loading',
            startAutomatically: true,
            defaultTheme: 'true',
            loadWasmHelper: true,
            ...(options.intro||{}),
        }

        this.options = options

        /**
         * On Window Load
         */

        return this.start()

    }

    async start(){
        const introAppVue = require('./intro-app/intro-app').default;
        this.introAppVue = introAppVue(this.options);
    }

    async loadApp(){

        if (this.introAppVue) {
            this.introAppVue.unmount()
            document.getElementById(this.options.intro.appId.slice(1)).remove()
        }

        const mainVue = require('./app/main-vue').default;
        this.walletAppVue = await mainVue(this.options);
    }

}

const main = new Main();

if ( typeof window !== 'undefined')
    window.PandoraPayWallet = main;

export default main;
