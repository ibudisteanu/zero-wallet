import Vue from 'vue';

export default {

    setNetworkByte(context, {networkByte, networkPrefix}) {

        context.networkByte = networkByte;
        context.networkPrefix = networkPrefix;

    },

}