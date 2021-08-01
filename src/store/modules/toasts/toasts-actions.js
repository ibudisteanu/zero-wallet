export default {

    addToast( {state, dispatch, commit}, data ){
        data.id = Math.random().toString()
        commit('setToast', data)

        // setTimeout(()=>{
        //     commit('removeToast', data.id )
        // }, 5000)

    }

}
