<template>

    <div>

        <div v-if="!error">

            <home-page v-if="loggedIn" />
            <login-page v-if="!loggedIn" />


        </div>

        <div v-if="error">

        </div>

    </div>

</template>

<script>

import HomePage from "./pages/dashboard/dashboard.page";
import LoginPage from "./pages/login/login.page";

export default {

    components: {HomePage, LoginPage },

    data(){
        return {
            loggedIn: false,
            error: '',

            encrypted: null,
            version: null,

        }
    },

    async mounted(){

        if (typeof window === "undefined") return;

        global.apacache.events.on("wallet/loaded", (wallet) => {
            console.log("LOADED");
            this.encrypted = wallet.encrypted;
            this.version = wallet.version;
            this.loggedIn = wallet.isLoggedIn();
        });

        global.apacache.events.on("wallet/loaded-error", err => {
            this.error = err;
        });

        global.apacache.start();

    }

}
</script>