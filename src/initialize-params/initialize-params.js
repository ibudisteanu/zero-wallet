class InitializeParams{

    constructor(){

        this.wallet = {
            activated: true,
            style: "dark",
            id: "Wallet",
        };

        /**
         * On Window Load
         */

        console.log("User-Interface-Loaded");
        this.load();

    }

    load(){

        const mainVue = require('./../main-vue').default;

        mainVue(this.wallet);

        this.createElements();

    }

    createElements(){



    }




}

export default new InitializeParams();
