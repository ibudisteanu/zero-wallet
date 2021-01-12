<template>
    <div class="topbar">
        <div class="header pd-top-10 pd-bottom-10">

            <div class="container boxed" >

                <div class="row">

                    <router-link to="/sidechains/list" :class="`${route === '/sidechains/list'? 'selected' : ''}`">
                        <i class="fa fa-inbox"></i>
                        Sidechains
                    </router-link>

                    <router-link to="/sidechains/balance" :class="`${route === '/sidechains/balance'? 'selected' : ''}`">
                        <i class="fa fa-wallet"></i>
                        Balance
                    </router-link>

                    <router-link to="/sidechains/transfer" :class="`${route === '/sidechains/transfer'? 'selected' : ''}`">
                        <i class="fa fa-money-bill-alt"></i>
                        Transfer
                    </router-link>

                    <router-link to="/sidechains/chat" :class="`${route === '/sidechains/chat'? 'selected' : ''}`">
                        <i class="fa fa-comments"></i>
                        Chat
                    </router-link>

                    <router-link to="/sidechains/trading" :class="`${route === '/sidechains/trading'? 'selected' : ''}`">
                        <i class="fa fa-coins"></i>
                        Trading
                    </router-link>

                    <router-link to="/sidechains/dex" :class="`${route === '/sidechains/shop'? 'selected' : ''}`">
                        <i class="fa fa-shopping-cart"></i>
                        P2P Shop
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
