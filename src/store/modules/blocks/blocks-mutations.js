import Vue from 'vue';

export default {

    deleteBlocks(state, blocks ){
        for (const block of blocks){
            Vue.delete(state.blocksByHeight, block.height);
            Vue.delete(state.blocksByHash, block.bloom.hash );
        }
    },

    setBlock(state, {hash, height, block}){

        if (!block) block = state.blocksByHash[hash] || state.blocksByHeight[height]
        if (!block) return console.error("Block was not found")

        block.__timestampUsed = new Date().getTime()
        Vue.set(state.blocksByHeight, block.height, block);
        Vue.set(state.blocksByHash, block.bloom.hash, block );
    },

    setViewBlockHash(state, hash){
        state.viewBlockHash = hash
        if (hash) state.commit('setBlock', {hash} )
    }

}
