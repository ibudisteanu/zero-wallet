<template>
    <div class="sidebar" :style="{width: width+'px'}">

        <router-link to="/" :class="`${route === '/' ? 'selected' : ''}`">
            <i class="fa fa-wallet" ></i>
            <span>Wallet</span>
        </router-link>

        <router-link to="/send-money" :class="`${route === '/send-money' ? 'selected' : ''}`" >
            <i class="fa fa-money-bill-alt"></i>
            <span>Send</span>
        </router-link>

        <router-link to="/receive-money" :class="`${route === '/receive-money' ? 'selected' : ''}`" >
            <i class="fa fa-hand-holding-usd"></i>
            <span>Receive</span>
        </router-link>

        <router-link to="/account" :class="`${route === '/account' ? 'selected' : ''}`"  >
            <i class="fa fa-file-invoice-dollar"></i>
            <span>Account</span>
        </router-link>

        <router-link to="/set-password" v-if="!encrypted" :class="`${route === '/set-password' ? 'selected' : ''}`"  >
            <i class="fa fa-unlock-alt"></i>
            <span>Encrypt</span>
        </router-link>

        <router-link to="/remove-password" v-if="encrypted" :class="`${route === '/remove-password' ? 'selected' : ''}`"  >
            <i class="fa fa-lock"></i>
            <span>Decrypt</span>
        </router-link>

        <router-link to="/explorer" :class="`${route.indexOf('/explorer') === 0 ? 'selected' : ''}`" >
            <i class="fa fa-cubes"></i>
            <span>Explorer</span>
        </router-link>

        <router-link to="/exchange/buy" :class="`${route.indexOf('/exchange') === 0 ? 'selected' : ''}`"  >
            <i class="fa fa-coins"></i>
            <span>Exchange</span>
        </router-link>

        <router-link to="/shop" :class="`${route.indexOf('/shop') === 0 ? 'selected' : ''}`"  >
            <i class="fa fa-shopping-cart"></i>
            <span>Shop</span>
        </router-link>

    </div>
</template>

<script>
export default {

    computed:{

        width(){
            return 70;
        },

        encrypted(){
            return this.$store.state.wallet.encrypted;
        },

        route(){
            return this.$router.currentRoute.path;
        }

    },

    methods:{

    },

}
</script>

<style scoped>

    .sidebar {
        height: 100%;
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        transition: 0.5s;
        overflow-x: hidden;
        white-space: nowrap;

        padding-top: 10px;

        box-shadow: 5px 0 5px -5px #BBB;
        background-color: white;
    }

    .sidebar a {
        color: #818181;
        display: block;
        padding-bottom: 20px;
        text-align: center;
        cursor: pointer;
    }

    .sidebar a.selected{
        color: #6c6ce0;
    }

    .sidebar a:hover {
        color: black;
    }

    .sidebar i{
        font-size: 25px;
    }

    .sidebar i,
    .sidebar span{
        display: block;
    }

    @media screen and (max-height: 450px) {
        .sidebar {
            padding-top: 15px;
        }
        .sidebar a {
            font-size: 18px;
        }
    }


</style>
