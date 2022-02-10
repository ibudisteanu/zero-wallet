
export default {

    addAddress( state, address ){
        state.list[address.publicKey] = address;
    },


}
