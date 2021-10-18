import Vue from 'vue';

export default {

    deleteAssets(context, {assets}) {
        for (const key in assets)
            Vue.delete(context.list, key);
    },

    setAsset(context, asset ) {
        Vue.set(context.list, asset.hash, asset )
    },

    setAssetsCount(context, { count }) {
        context.count = count;
    },


}
