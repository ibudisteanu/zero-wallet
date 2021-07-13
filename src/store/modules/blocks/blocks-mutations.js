import Vue from 'vue';

export default {

    deleteBlock(state, {height, hash} ){
        Vue.delete(state.blocksByHeight, height);
        Vue.delete(state.blocksByHash, hash );
    },

    setBlock(state, blk ){
        blk.__timestampUsed = new Date().getTime()
        Vue.set(state.blocksByHeight, blk.height, blk);
        Vue.set(state.blocksByHash, blk.bloom.hash, blk );
    },

    setViewBlockHash(state, hash){
        state.viewBlockHash = hash

        if (hash)
            state.commit('setBlock', state.blocksByHash[hash])
    }

}
