export default {

    isTestnet: state => {
        return state.networkByte !== 0;
    },

    networkName: state => {
        if (state.networkByte === 0) return 'MAIN NET';
        if (state.networkByte === 128) return 'TEST NET';
        return 'UNKNOWN NETWORK';
    },




}