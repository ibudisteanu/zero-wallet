<template>
    <div class="footer">

        <div class="boxed">
            <div class="row pd-bottom-10 disabled">
                <span>Consensus</span>
                <span class="color">{{blockchainStatus}}</span>
                <span>Block Height </span>
                <span class="color">#{{blockHeight}}</span>
            </div>
            <div class="row disabled">
                <span>© 2019 {{entity}} - Wallet v {{version}}</span>
            </div>
            <div class="row disabled">
                <span>Disclaimer</span>
                <span>Safety</span>
            </div>

        </div>

    </div>
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
            if (status === 'syncing') return 'Synching';
            if (status === 'offline') return 'Offline';
            if (status === 'online') return 'Connected';

            return 'na';
        }

    },

}
</script>

<style scoped>
    .footer{
        padding-top: 50px;
    }

    .row{
        text-align: center;
    }

    .row span{
        display:inline-block;
    }

    .color{
        color: #21254a !important;
    }

</style>