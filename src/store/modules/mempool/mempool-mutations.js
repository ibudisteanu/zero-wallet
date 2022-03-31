export default {

    setMempool(state, { page, mempool }) {

        const list = {}

        mempool.hashes.map(hash => list[hash] = true )

        state.list = list;
        state.chainHash = mempool.chainHash
        state.page = state.page.plus(1);
        state.count = mempool.count;
    },


}
