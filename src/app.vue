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

        global.apacache.events.on("wallet/loaded", async (wallet) => {
            console.log("LOADED");
            this.$store.commit('setEncrypted', wallet.encrypted );
            this.$store.commit('setVersion', wallet.version );

            await this.readAddresses();

            this.$store.commit('setLoggedIn', wallet.isLoggedIn() );
        });

        global.apacache.events.on("wallet/address-removed", async (walletAddress) => this.readAddresses() );

        global.apacache.events.on("wallet/address-pushed", async (walletAddress) => this.readAddresses() );

        global.apacache.events.on("wallet/loaded-error", err => {
            this.error = err;
        });

        global.apacache.start();

    },

    methods:{

        async readAddresses(){

            const wallet = global.apacache.wallet;

            let firstAddress;
            const addresses = {};
            for (let i=0; i < wallet.addresses.length; i++ ){

                const publicAddress = await wallet.addresses[i].decryptPublicAddress();
                const address = publicAddress.calculateAddress();
                addresses[address] = {
                    address: address,
                    name: wallet.addresses[i].name,
                    identicon: publicAddress.identiconImg(),
                };

                if (i === 0)
                    firstAddress = address;
            }

            if (this.$store.mainAddress && !addresses[this.$store.mainAddress]){
                this.$store.commit('setMainAddress', null );
            }

            if (!this.$store.mainAddress && firstAddress )
                this.$store.commit('setMainAddress', firstAddress );


            this.$store.commit('setAddresses', addresses );


        }

    },

}
</script>