import Vue from 'vue';

export default {

    deleteTokens(context, {tokens}) {
        for (const key in tokens)
            Vue.delete(context.list, key);
    },

    setTokens(context, tokens ) {
        for (const key in tokens){
            Vue.set(context.list, key, tokens[key] )
        }
    },

    setTokenInfo(context, tokenInfo ) {
        Vue.set(context.tokensInfo, tokenInfo.hash, tokenInfo)
    },

    setTokensCount(context, { count }) {
        context.count = count;
    },


}
