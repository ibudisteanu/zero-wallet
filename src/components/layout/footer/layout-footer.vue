<template>
    <footer class="footer">
        <div class="g-0 justify-content-between fs--1 mt-4 mb-3 text-600">

            <div class="row pb-1 mb-0">
                <div class="col-12 col-auto text-center">
                    <span>Consensus</span>
                    <span v-if="$store.state.blockchain.status === 'sync'" class="text-success">{{blockchainStatus}}</span>
                </div>
                <div class="col-12 col-auto text-center">
                    <span>Block Height</span>
                    <span v-if="blockHeight" class="text-success">#{{blockHeight}}</span>
                </div>
            </div>

            <div class="row pb-0 mb-0">
                <div class="col-12 col-auto text-center">
                    <span>2019 - 2021 <a href="https://PandoraPay.org" target="_blank">{{entity}}</a> Wallet v {{version}} </span>
                </div>
            </div>

        </div>


        <div class="fixedButton pointer" @click="handleShowTestnetFaucer" v-tooltip.top="`Testnet Faucet`">
            <div class="roundedFixedBtn btn-primary"><i class="fa fa-coins"></i></div>
        </div>

    </footer>

</template>

<script>
import consts from 'consts/consts';
export default {

    computed:{
        entity(){
            return consts.entity;
        },

        version(){
            return consts.version;
        },

        blockHeight(){
            return this.$store.state.blockchain.end;
        },

        blockchainStatus(){

            const status = this.$store.state.blockchain.status;

            if (status === 'sync') return 'Established';
            if (status === 'syncing') return 'Syncing';
            if (status === 'offline') return 'Offline';
            if (status === 'online') return 'Connected';

            return 'na';
        },
    },

    methods:{
        handleShowTestnetFaucer(){
            this.$store.state.page.refTestnetFaucetModal.showModal()
        },
    }

}
</script>

<style scoped>

    .fixedButton{
        position: fixed;
        bottom: 0;
        right: 0;
        padding: 0 20px 20px 20px;;
    }
    .roundedFixedBtn{
        height: 60px;
        line-height: 60px;
        width: 60px;
        font-size: 2em;
        border-radius: 50%;
        text-align: center;
        cursor: pointer;
    }

</style>
