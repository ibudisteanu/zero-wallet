export default {

    getTokenInfo: state => (hash) => {
        if (!hash.length) hash = PandoraPay.config.coins.NATIVE_TOKEN_FULL_STRING_HEX
        return state.list[hash]
    },

}
