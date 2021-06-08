export default {

    getTokenInfo: state => (hash) => {

        if (!hash)
            hash = PandoraPay.config.coins.NATIVE_TOKEN_FULL_STRING_HEX

        return state.tokensInfo[hash]
    }

}
