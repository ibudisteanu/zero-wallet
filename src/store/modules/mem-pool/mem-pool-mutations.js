import Vue from 'vue';

export default {

    setMemPool(context, { start, mempool }) {

        let list
        if (start !== 0)
            list = {... ( context.list || {} ) };
        else
            list = {}


        for (const hash of mempool.hashes)
            list[hash] = true;

        context.list = list;
        context.start = start;
        context.count = mempool.count;
    },


}
