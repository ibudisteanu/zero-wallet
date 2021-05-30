export default {

    isTestnet: state => {
        return state.networkByte !== 0;
    },

}
