import Vue from 'vue';

export default {

    setBlockchainInfo(context, data){
        context.end = data.end;
        context.hash = data.hash;
        context.prevHash = data.prevHash;
    },

    setBlockchainInfoGenesis(context, data){
        context.genesisTimestamp = data.timestampGenesis;
    },

    setConsensusStatus(context, status){
        context.status = status;
    },

    setBlockchainBlocksInfo(context, blocksInfo ){
        for (const key in blocksInfo){
            Vue.set(context.blocksInfo, blocksInfo[key].height, blocksInfo[key]);
        }
    },

    deleteBlockchainBlocksInfo(context, blocksInfo  ){
        for (const height of blocksInfo){
            Vue.delete(context.blocksInfo, height);
        }
    },

    deleteBlockchainBlock(context, {height, hash} ){
        Vue.delete(context.blocks, height);
        Vue.delete(context.blocksByHash, hash );
    },

    setBlockchainBlock(context, blk ){
        Vue.set(context.blocks, blk.height, blk);
        Vue.set(context.blocksByHash, blk.bloom.hash, blk );
    },


}
