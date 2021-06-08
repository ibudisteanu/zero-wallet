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


}
