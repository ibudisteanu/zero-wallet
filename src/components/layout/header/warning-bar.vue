<template>
    <div>
        <div class="warning" v-if="shown">
            You are connecting to the {{networkPrefix}}. Don't use your Mainnet accounts in the Testnet!
            <i class="fa fa-times" @click="hide"></i>
        </div>
    </div>
</template>

<script>
export default {

    data(){
        return {
            shown: true,
        }
    },

    methods:{

        hide(){
            this.shown = false;
        },

    },

    computed:{

        networkPrefix(){
            if (this.$store.state.network.networkByte === 0 ) return 'MAIN NET';
            if (this.$store.state.network.networkByte === 128 ) return 'TEST NET';
            return 'UNKNOWN NETWORK';
        }

    }

}
</script>

<style scoped>

    .warning{

        padding: 10px;
        color: #3b3b3b;
        text-align: center;
        background-color: #eaaa16;

    }

    .warning i{
        float: right;
        cursor: pointer;
    }

</style>