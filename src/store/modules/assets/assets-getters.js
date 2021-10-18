export default {

    getAsset: state => (hash) => {
        if (hash === null) return
        return state.list[hash]
    }

}
