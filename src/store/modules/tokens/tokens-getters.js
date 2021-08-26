export default {

    getToken: state => (hash) => {
        if (hash === null) return
        if (!hash.length) hash = PandoraPay.config.coins.NATIVE_TOKEN_FULL_STRING_HEX
        return state.list[hash]
    }

}
