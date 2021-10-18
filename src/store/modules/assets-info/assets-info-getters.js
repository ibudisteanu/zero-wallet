export default {

    getAssetInfo: state => (hash) => {
        return state.list[hash]
    },

}
