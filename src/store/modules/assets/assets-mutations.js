export default {

    deleteAssets(context, {assets}) {
        for (const key in assets)
            delete context.list[key];
    },

    setAsset(context, asset ) {
        context.list[asset.hash] = asset
    },

}
