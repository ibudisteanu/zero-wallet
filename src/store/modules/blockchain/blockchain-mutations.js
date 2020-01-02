import Vue from 'vue';

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

    setBlockchainBlocksInfo(context, {end, start, blocksInfo} ){

        for (const height in blocksInfo)
            Vue.set( context.blocksInfo, height, blocksInfo[height] );

    }

}