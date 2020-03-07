import Vue from 'vue';

export default {

    deleteTokens(context, {tokens}) {

        for (const key in tokens)
            Vue.delete(context.list, key);

    },

    setTokens(context, {tokens}) {

        const list = {... ( context.list || {} )};

        for (const key in tokens)
            list[key] = tokens[key];

        context.list = list;
    },

}