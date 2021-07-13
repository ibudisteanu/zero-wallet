import Vue from 'vue';

export default {

    deleteBlock(state, {height, hash} ){
        Vue.delete(state.blocksByHeight, height);
        Vue.delete(state.blocksByHash, hash );
    },

    setBlock(state, blk ){
        Vue.set(state.blocksByHeight, blk.height, blk);
        Vue.set(state.blocksByHash, blk.bloom.hash, blk );
    },

    setViewBlockHash(state, hash){
        state.viewBlockHash = hash
    }

}
