export default {

    getAssetInfo: state => (hash) => {
        if (!hash.length) hash = PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX
        return state.list[hash]
    },

}
