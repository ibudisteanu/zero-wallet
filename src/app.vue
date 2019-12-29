<template>

    <div>

        <home-page v-if="loggedIn" />
        <login-page v-if="!loggedIn" />

    </div>

</template>

<script>

import HomePage from "./pages/home/home.page";
import LoginPage from "./pages/login/login.page";

export default {

    components: {HomePage, LoginPage },

    data(){
        return {
            loggedIn: false,
        }
    }

}
</script>