export default {

    isTestnet: state => {
        return state.networkByte === PandoraPay.config.TEST_NET_NETWORK_BYTE || state.networkByte === PandoraPay.config.DEV_NET_NETWORK_BYTE;
    },

}
