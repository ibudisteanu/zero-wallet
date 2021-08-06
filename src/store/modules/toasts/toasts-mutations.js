import Vue from 'vue';

export default {
    setToast(state, data ) {
        Vue.set(state.list,state.list.length, data )
    },
    removeToast(state, id){
        for (let i=0; i < state.list.length; i++)
            if (state.list[i].id === id)
                return Vue.delete(state.list, i )
    }
}
