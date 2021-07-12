import Vue from 'vue';

export default {

    deleteTokens(context, {tokens}) {
        for (const key in tokens)
            Vue.delete(context.list, key);
    },

    setToken(context, token ) {
        Vue.set(context.list, token.hash, token )
    },

    setTokensCount(context, { count }) {
        context.count = count;
    },


}
