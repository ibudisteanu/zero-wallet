export default {
    setToast(state, data ) {
        state.list [state.list.length] = data
    },
    removeToast(state, id){
        for (let i=0; i < state.list.length; i++)
            if (state.list[i].id === id)
                return state.list.splice(i, 1)
    }
}
