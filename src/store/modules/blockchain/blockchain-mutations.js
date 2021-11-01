import Vue from 'vue';

export default {

    setBlockchainNotification(store, data){
        store.end = data.end;
        store.hash = data.hash;
        store.prevHash = data.prevHash;
    },

    setBlockchainInfo(store, data){
        store.assets = data.assets;
        store.transactions = data.transactions;
    },

    setBlockchainInfoGenesis(store, data){
        store.genesisTimestamp = data.timestampGenesis;
    },

    setConsensusStatus(store, status){

        if (status === store.status) return;

        if (store.status === "sync" && status === "offline")
            store.commit('createSyncPromise');

        store.status = status;

        if (status === "sync" && !store.syncPromiseResolved)
            store.syncPromiseResolve(true);
    },

    createSyncPromise(store){
        if (!store.syncPromiseResolved)
            store.syncPromise = new Promise( resolve => {
                store.syncPromiseResolve = resolve;
            });
    }

}
