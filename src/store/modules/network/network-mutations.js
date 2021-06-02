import Vue from 'vue';

export default {

    setNetworkByte(context, {networkByte, networkName, networkPrefix}) {

        context.networkByte = networkByte;
        context.networkName = networkName;
        context.networkPrefix = networkPrefix

    },

}
