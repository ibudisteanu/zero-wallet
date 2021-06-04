import Vue from "vue";

export default {

    addAddress( context, address ){
        Vue.set(context.list, address.publicKeyHash, address );
    },

    addAddresses( context, addresses ){
        for (const publicKeyHash in addresses ){
            Vue.set(context.list, publicKeyHash, addresses[publicKeyHash] );
        }
    },

    setAddressLoaded(context, {publicKeyHash, loaded}){
        const address = { ... context.list[publicKeyHash]  };
        address.loaded = loaded;

        Vue.set(context.list, publicKeyHash, address );
    },

    setTransparentAddressUpdate(context, {account, publicKeyHash }){
        const address = { ... context.list[publicKeyHash]  };
        address.account = account
        address.loaded = true;

        Vue.set(context.list, publicKeyHash, address );
    },

}
