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

    setBlockchainBlockInfo(context, blockInfo ){
        Vue.set(context.blocksInfo, blockInfo.height, blockInfo);
    },

    deleteBlockchainBlock(context, {height, hash} ){
        Vue.delete(context.blocks, height);
        Vue.delete(context.blocksByHash, hash.toString("hex") );
    },


    setBlockchainBlock(context, blk ){
        Vue.set(context.blocks, blk.height, blk);
        Vue.set(context.blocksByHash, blk.bloom.hash, blk );
    },


}
