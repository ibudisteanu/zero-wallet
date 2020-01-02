<template>
    <div class="sidebar" :style="{width: width+'px'}">

        <div @click="setPage('wallet')">
            <i class="fa fa-wallet" ></i>
            <span>Wallet</span>
        </div>

        <div @click="setPage('send-money')">
            <i class="fa fa-money-bill-alt"></i>
            <span>Send</span>
        </div>

        <div @click="setPage('receive-money')">
            <i class="fa fa-hand-holding-usd"></i>
            <span>Receive</span>
        </div>

        <div @click="setPage('account-info')">
            <i class="fa fa-file-invoice-dollar"></i>
            <span>Account</span>
        </div>

        <div v-if="!encrypted" @click="setPage('set-password')">
            <i class="fa fa-unlock-alt"></i>
            <span>Encrypt</span>
        </div>

        <div v-if="encrypted" @click="setPage('remove-password')">
            <i class="fa fa-lock"></i>
            <span>Decrypt</span>
        </div>

        <div @click="setPage('explorer')">
            <i class="fa fa-cubes"></i>
            <span>Explorer</span>
        </div>

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
        setPage(pageActiveName){
            this.$store.commit('setPageActive', pageActiveName)
        }
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

    .sidebar div {
        text-decoration: none;
        color: #818181;
        display: block;
        padding-bottom: 20px;
        text-align: center;
        cursor: pointer;
    }

    .sidebar div:hover {
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