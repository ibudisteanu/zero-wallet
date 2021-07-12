import Vue from 'vue';

export default {

    setBlockchainInfo(store, data){
        store.end = data.end;
        store.hash = data.hash;
        store.prevHash = data.prevHash;
    },

    setBlockchainInfoGenesis(store, data){
        store.genesisTimestamp = data.timestampGenesis;
    },

    setConsensusStatus(store, status){

        if (status === store.status) return;

        if (store.status === "sync" && status === "offline")
            store.commit('createSyncPromise');

        store.status = status;

        if (status === "sync") {
            store.syncPromiseResolve(true);
            store.syncPromise = null
        }
    },

    createSyncPromise(store){
        if (store.syncPromise === null)
            store.syncPromise = new Promise( resolve => {
                store.syncPromiseResolve = resolve;
            });
    }

}
