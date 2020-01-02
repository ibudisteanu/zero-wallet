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

    setBlockchainBlockInfo(context, blockInfo ){

        Vue.set(context.blocksInfo, blockInfo.height, blockInfo);

    }

}