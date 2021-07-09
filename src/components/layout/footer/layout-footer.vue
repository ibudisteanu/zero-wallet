<template>
    <footer class="footer">
        <div class="g-0 justify-content-between fs--1 mt-4 mb-3 centered">

            <div class="row pd-bottom-10 gray">
                <div class="col-6">
                    <span>Consensus</span>
                    <span class="color">{{blockchainStatus}}</span>
                </div>
                <div class="col-6">
                    <span>Block Height </span>
                    <span class="color">#{{blockHeight}}</span>
                </div>
            </div>

            <div class="row gray">
                <div class="col-6">
                    <span>Disclaimer</span>
                </div>
                <div class="col-6">
                    <span>Safety</span>
                </div>
            </div>

            <div class="row gray">
                <span>2019 - 2021 <a href="http://PandoraPay.org" target="_blank">{{entity}}</a> - Wallet v {{version}}</span>
            </div>

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

        chatIndex(){
            return this.$store.state.chat.index;
        },

        chatStatus(){
            const status = this.$store.state.chat.status;

            if (status === 'sync') return 'Established';
            if (status === 'syncing') return 'Synching';
            if (status === 'offline') return 'Offline';
            if (status === 'online') return 'Connected';

            return 'na';
        },

    },

}
</script>

<style scoped>

    .color{
        color: #21254a !important;
    }

</style>
