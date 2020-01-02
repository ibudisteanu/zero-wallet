<template>
    <div class="sidebar">

        <div>
            <i class="fa fa-long-arrow-down"></i>
            <span>Send</span>
        </div>

        <div>
            <i class="fa fa-long-arrow-up"></i>
            <span>Receive</span>
        </div>

        <div>
            <i class="fa fa-info"></i>
            <span>Account</span>
        </div>

        <div v-if="encrypted">
            <i class="fa fa-unlock-alt"></i>
            <span>Encrypt</span>
        </div>

        <div v-if="!encrypted">
            <i class="fa fa-lock"></i>
            <span>Decrypt</span>
        </div>

        <div>
            <i class="fa fa-cubes"></i>
            <span>Explorer</span>
        </div>

    </div>
</template>

<script>
export default {

    computed:{
        encrypted(){
            return this.$store.state.wallet.encrypted;
        }
    },

}
</script>

<style scoped>

    .sidebar {
        height: 100%;
        width: 70px;
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