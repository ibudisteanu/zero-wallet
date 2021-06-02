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
        context.next = Math.min( blockInfo.height ? blockInfo.height - 1 : 0, context.next !== null ? context.next : Number.MAX_SAFE_INTEGER ) ;
    },

    deleteBlockchainBlock(context, {height, hash} ){
        Vue.delete(context.blocks, height);
        Vue.delete(context.blocksByHash, hash.toString("hex") );
    },


    setBlockchainBlock(context, blkComplete ){
        Vue.set(context.blocks, blkComplete.block.height, blkComplete);
        Vue.set(context.blocksByHash, blkComplete.block.bloom.hash, blkComplete);
    },


}
