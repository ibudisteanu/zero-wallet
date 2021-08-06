import Vue from 'vue';

export default {

    deleteBlocks(state, blocks ){
        const {blocksByHeight, blocksByHash } = state

        for (const block of blocks){
            delete blocksByHeight[block.height]
            delete blocksByHash[block.bloom.hash]
        }
        state.blocksByHeight = {...blocksByHeight}
        state.blocksByHash = {...blocksByHash}
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
    }

}
