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

</style>
