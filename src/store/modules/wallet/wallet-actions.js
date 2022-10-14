import Identicons from "src/utils/identicons"

export default {

    async readWallet( {state, dispatch, commit} ){

        const walletData = await PandoraPay.wallet.getWallet()
        const wallet = JSONParse( MyTextDecode( walletData ) )

        wallet.isEncrypted = wallet.encryption.encrypted.equals( PandoraPay.enums.wallet.encryptedVersion.ENCRYPTED_VERSION_ENCRYPTION_ARGON2 )

        console.log("wallet received", wallet)

        await dispatch('readAddresses', wallet);

    },

    async readAddresses( {state, dispatch, commit}, wallet ){

        let mainPublicKey = state.mainPublicKey || localStorage.getItem('mainPublicKey') || null;

        let firstAddress;
        const addresses = {};
        for (let i=0; i < wallet.addresses.length; i++ ){

            const publicKey = wallet.addresses[i].publicKey
            const addr = {
                ...wallet.addresses[i],
                publicKey,
            };

            addresses[publicKey] = addr;

            if (i === 0)
                firstAddress = publicKey;
        }

        //localstorage
        if (mainPublicKey && !addresses[mainPublicKey])
            mainPublicKey = null

        if (!mainPublicKey && firstAddress )
            mainPublicKey = firstAddress;

        commit('setWallet', { addresses, wallet, mainPublicKey } );

    },

}
