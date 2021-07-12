import Vue from "vue";

export default {

    addAddress( context, address ){
        Vue.set(context.list, address.publicKeyHash, address );
    },


}
