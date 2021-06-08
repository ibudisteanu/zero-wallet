import Vue from 'vue';

export default {

    deleteTokens(context, {tokens}) {
        for (const key in tokens)
            Vue.delete(context.list, key);
    },

    setToken(context, token ) {
        Vue.set(context.list, token.hash, token )
    },

    setTokenInfo(context, tokenInfo ) {
        Vue.set(context.tokensInfo, tokenInfo.hash, tokenInfo)
    },

    setTokensCount(context, { count }) {
        context.count = count;
    },


}
