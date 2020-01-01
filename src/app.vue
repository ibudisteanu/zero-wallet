<template>

    <div>

        <div v-if="!error">

            <dashboard v-if="$store.state.loggedIn"/>
            <login-page v-if="!$store.state.loggedIn" />


        </div>

        <div v-if="error">
            {{error}}
        </div>

    </div>

</template>

<script>

import Dashboard from "./pages/dashboard/dashboard.page";
import LoginPage from "./pages/login/login.page";

export default {

    components: {Dashboard, LoginPage },

    data(){
        return {
            error: '',

        }
    },

    async mounted(){

        if (typeof window === "undefined") return;

        global.apacache.events.on("wallet/loaded", wallet => this.readWallet() );

        global.apacache.events.on("wallet/address-removed", walletAddress => this.readAddresses() );

        global.apacache.events.on("wallet/address-pushed", walletAddress => this.readAddresses() );

        global.apacache.events.on("wallet/loaded-error", err => {
            this.error = err;
        });

        global.apacache.events.on("wallet/encrypted",async encrypted => this.$store.commit('setEncrypted', encrypted ) );

        global.apacache.events.on("wallet/loggedIn", loggedIn => {

            if (loggedIn)
                return this.readWallet();
            else {
                this.clearWallet();
                return this.readWallet();
            }

        } );

        global.apacache.start();

    },

    methods:{

        readWallet(){

            const wallet = global.apacache.wallet;

            this.$store.commit('setEncrypted', wallet.encrypted );
            this.$store.commit('setVersion', wallet.version );

            const loggedIn = wallet.isLoggedIn();
            this.$store.commit('setLoggedIn', loggedIn );

            this.readAddresses();

            this.$store.commit('setLoaded', true);

        },

        clearWallet(){
            return this.$store.commit('clear');
        },

        readAddresses(){

            const wallet = global.apacache.wallet;

            if ( !wallet.isLoggedIn() ) return;

            let minerAddress = localStorage.getItem('mainAddress') || null;

            let firstAddress;
            const addresses = {};
            for (let i=0; i < wallet.addresses.length; i++ ){

                const publicAddress =  wallet.addresses[i].decryptPublicAddress();
                const mnemonicSequenceIndex =  wallet.addresses[i].decryptMonemonicSequenceIndex();
                const mnemonicSequenceIndexValue = Number.parseInt( mnemonicSequenceIndex.toString("hex"), 16);

                const address = publicAddress.calculateAddress();
                addresses[address] = {
                    address: address,
                    name: wallet.addresses[i].name,
                    mnemonicSequenceIndex: mnemonicSequenceIndexValue ,
                    identicon: publicAddress.identiconImg(),
                };

                if (i === 0)
                    firstAddress = address;
            }

            //localstorage
            if (minerAddress && addresses[minerAddress])
                this.$store.commit('setMainAddress', minerAddress);


            if (this.$store.state.mainAddress && !addresses[this.$store.state.mainAddress])
                this.$store.commit('setMainAddress', null );


            if (!this.$store.state.mainAddress && firstAddress )
                this.$store.commit('setMainAddress', firstAddress );


            this.$store.commit('setAddresses', addresses );


        }

    },

}
</script>