export default {
    walletContains: (state)=>(addressPublicKeyHash)=>{
        for (const key in state.addresses){
            if (state.addresses[key].publicKeyHash === addressPublicKeyHash){
                return state.addresses[key]
            }
        }
        return null
    },

    isWalletEncrypted: (state) => () => {
        return state.isEncrypted
    }

}
