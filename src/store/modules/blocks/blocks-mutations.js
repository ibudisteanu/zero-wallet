export default {

    deleteBlocks(state, blocks ){

        for (const block of blocks){
            delete state.blocksByHeight[block.height]
            delete state.blocksByHash[block.bloom.hash]
        }

    },

    setBlock(state, {hash, height, block}){

        if (!block) block = state.blocksByHash[hash] || state.blocksByHeight[height]
        if (!block) return console.error("Block was not found")

        block.__timestampUsed = new Date().getTime()
        state.blocksByHeight[ block.height ] = block;
        state.blocksByHash[ block.bloom.hash ] = block;
    },

    setViewBlockHash(state, hash){
        state.viewBlockHash = hash
    }

}
