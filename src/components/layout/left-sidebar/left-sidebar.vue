<template>
    <div class="sidebar" :style="{width: width+'px'}">

        <router-link to="/" >
            <i class="fa fa-wallet" ></i>
            <span>Wallet</span>
        </router-link>

        <router-link to="send-money" >
            <i class="fa fa-money-bill-alt"></i>
            <span>Send</span>
        </router-link>

        <router-link to="receive-money" >
            <i class="fa fa-hand-holding-usd"></i>
            <span>Receive</span>
        </router-link>

        <router-link to="account" >
            <i class="fa fa-file-invoice-dollar"></i>
            <span>Account</span>
        </router-link>

        <router-link to="set-password" v-if="!encrypted" >
            <i class="fa fa-unlock-alt"></i>
            <span>Encrypt</span>
        </router-link>

        <router-link to="remove-password" v-if="encrypted" >
            <i class="fa fa-lock"></i>
            <span>Decrypt</span>
        </router-link>

        <router-link to="explorer" >
            <i class="fa fa-cubes"></i>
            <span>Explorer</span>
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
        text-decoration: none;
        color: #818181;
        display: block;
        padding-bottom: 20px;
        text-align: center;
        cursor: pointer;
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