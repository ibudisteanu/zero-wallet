import Vue from 'vue';

export default {

    deleteBlock(context, {height, hash} ){
        Vue.delete(context.blocksByHeight, height);
        Vue.delete(context.blocksByHash, hash );
    },

    setBlock(context, blk ){
        Vue.set(context.blocksByHeight, blk.height, blk);
        Vue.set(context.blocksByHash, blk.bloom.hash, blk );
    },


}
