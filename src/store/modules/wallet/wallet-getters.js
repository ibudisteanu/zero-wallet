export default {

    walletContains: (state)=>(addressPublicKey)=>{
        for (const key in state.addresses){
            if (state.addresses[key].publicKey === addressPublicKey){
                return state.addresses[key]
            }
        }
        return null
    },

    isWalletEncrypted: (state) => () => {
        return state.isEncrypted
    }

}
