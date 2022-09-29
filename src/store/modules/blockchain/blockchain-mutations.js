export default {

    setBlockchainInfo(store, data){
        store.end = data.height;
        store.hash = data.hash
        store.kernelHash = data.kernelHash
        store.assets = data.assets;
        store.transactions = data.transactions;
    },

    setBlockchainInfoGenesis(store, data){
        store.genesisTimestamp = data.timestampGenesis;
    },

    setConsensusStatus(store, status){

        if ( status === "offline" )
            this.commit('createSyncPromise');

        if ( status === "online" && !store.syncPromiseResolved) {
            store.syncPromiseResolve(true);
            store.syncPromiseResolved = true
        }

        store.status = status;
    },

    createSyncPromise(store){
        if (!store.syncPromise || store.syncPromiseResolved)
            store.syncPromise = new Promise(resolve => {
                store.syncPromiseResolve = resolve;
                store.syncPromiseResolved = false;
            });

    }

}
