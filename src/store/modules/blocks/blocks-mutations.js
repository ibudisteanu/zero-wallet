import Vue from 'vue';

export default {

    setBlocksInfo(context, blocksInfo ){
        for (const key in blocksInfo){
            Vue.set(context.blocksInfo, blocksInfo[key].height, blocksInfo[key]);
        }
    },

    deleteBlocksInfo(context, blocksInfo  ){
        for (const height of blocksInfo){
            Vue.delete(context.blocksInfo, height);
        }
    },

    deleteBlock(context, {height, hash} ){
        Vue.delete(context.blocks, height);
        Vue.delete(context.blocksByHash, hash );
    },

    setBlock(context, blk ){
        Vue.set(context.blocks, blk.height, blk);
        Vue.set(context.blocksByHash, blk.bloom.hash, blk );
    },


}
