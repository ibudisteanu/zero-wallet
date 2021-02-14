<template>
    <div class="topbar">
        <div class="header pd-top-10 pd-bottom-10">

            <div class="container boxed" >

                <div class="row">

                    <router-link to="/kad/chat" :class="`${route === '/kad/chat'? 'selected' : ''}`">
                        <i class="fa fa-comments"></i>
                        Encrypted Chat
                    </router-link>

                    <router-link to="/kad/dex" :class="`${route === '/kad/dex'? 'selected' : ''}`">
                        <i class="fa fa-coins"></i>
                        DEX
                    </router-link>

                    <router-link to="/kad/p2p/dex" :class="`${route === '/kad/p2p/dex'? 'selected' : ''}`">
                        <i class="fa fa-shopping-cart"></i>
                        Peer to Peer DEX
                    </router-link>

                    <router-link to="/kad/p2p/bazaar" :class="`${route === '/kad/p2p/bazaar'? 'selected' : ''}`">
                        <i class="fa fa-shopping-cart"></i>
                        Peer to Peer Bazaar
                    </router-link>

                </div>

            </div>

        </div>
    </div>
</template>

<script>
export default {

    computed:{

        route(){
            return this.$router.currentRoute.path;
        }

    }

}
</script>
