export default {

    setBlockchainNotification(store, data){
        store.end = data.end;
        store.hash = data.hash;
        store.prevHash = data.prevHash;
    },

    setBlockchainInfo(store, data){
        store.end = data.height;
        store.assets = data.assets;
        store.transactions = data.transactions;
    },

    setBlockchainInfoGenesis(store, data){
        store.genesisTimestamp = data.timestampGenesis;
    },

    setConsensusStatus(store, status){

        if (status === store.status) return;

        if (store.status === "sync" && status === "offline")
            this.commit('createSyncPromise');

        if ( status === "online" && !store.syncPromiseResolved)
            store.syncPromiseResolve(true);

        if (!(status === "online" && store.status === "sync"))
            store.status = status;

    },

    createSyncPromise(store){
        if (store.syncPromiseResolved)
            store.syncPromise = new Promise(resolve => {
                store.syncPromiseResolve = resolve;
                store.syncPromiseResolved = false;
            });

    }

}
