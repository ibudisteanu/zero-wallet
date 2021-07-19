import Vue from 'vue';

export default {

    setMemPool(state, { page, mempool }) {

        let list
        if (page !== 0)
            list = state.list || {};
        else
            list = {}


        for (const hash of mempool.hashes)
            list[hash] = true;

        state.list = {...list};
        state.page = page+1;
        state.count = mempool.count;
    },


}
