<template>

    <div>
        <div class="mobile-menu" @click="showMenu" :style="{display: show ? 'none' : 'inherit' }" >
            <i class="fa fa-bars"></i>
        </div>

        <div v-if="show" class="sidebar" :style="{display: show ? 'inherit' : 'none' }" v-on-clickaway="closeMenu" >

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
    </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
export default {

    mixins: [ clickaway ],

    data(){
        return {
            show: false,
            fullWidth: false,
        }
    },

    computed:{

        encrypted(){
            return this.$store.state.wallet.encrypted;
        },

        route(){
            return this.$router.currentRoute.path;
        }

    },

    methods:{
        showMenu(){
            this.show = true;
        },

        closeMenu(){

            if (this.fullWidth) return;

            this.show = false;
            console.log('show false');
        }
    },

    mounted(){

        const refresh = (e)=>{

            //note i need to pass the event as an argument to the function
            const width = window.innerWidth;
            const height = window.innerHeight;

            console.log("width", width);

            if (width <= 450) {
                this.show = false;
                this.fullWidth = false;
                this.$emit('onUpdateMarginLeft', {marginLeft: '0' });
            }
            else {
                this.show = true;
                this.fullWidth = true;
                this.$emit('onUpdateMarginLeft', {marginLeft: '70px' });
            }


        };

        window.addEventListener("resize", (e)=> refresh(e) );

        refresh(window);
    }

}
</script>

<style scoped>

    .sidebar {

        height: 100%;
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        overflow-x: hidden;
        white-space: nowrap;

        padding-top: 10px;

        box-shadow: 5px 0 5px -5px #BBB;
        background-color: white;

        width: 70px;
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

    .mobile-menu{
        display: none;
    }

    @media screen and (max-width: 450px) {

        .mobile-menu{
            color: #818181;
            font-size: 30px;
            position: fixed;
            top: 10px;
            left: 10px;
            background-color: white;
            padding-left: 10px;
            padding-right: 10px;
        }

        .sidebar {
            padding-top: 15px;
            width: 64px;
            display: none;
        }
        .sidebar a {
            font-size: 13px;
            padding-bottom: 10px;
        }
    }


</style>
