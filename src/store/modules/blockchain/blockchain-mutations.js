var Vue = require('vue/dist/vue.min.js');

export default {

    setBlockchainInfo(context, data){

        context.start = data.start;
        context.end = data.end;
        context.hash = data.hash;
        context.prevHash = data.prevHash;
        context.prevKernelHash = data.prevKernelHash;
        context.chainWork = data.chainWork;
    },

    setConsensusStatus(context, status){
        context.status = status;
    },

    setBlockchainBlocksHashes(context, {end, start, blocksHashes} ){

        for (const height in blocksHashes)
            Vue.set( context.blocksHashes, height, blocksHashes[height] );

    }

}