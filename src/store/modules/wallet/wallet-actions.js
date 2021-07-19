import Identicons from "src/utils/identicons"

export default {

    async readWallet( {state, dispatch, commit} ){

        const walletData = await PandoraPay.wallet.getWallet()
        const wallet = JSON.parse( walletData )

        wallet.isEncrypted = wallet.encryption.encrypted === PandoraPay.enums.wallet.encryptedVersion.ENCRYPTED_VERSION_ENCRYPTION_ARGON2

        console.log("wallet received", wallet)

        await dispatch('readAddresses', wallet);

    },

    async readAddresses( {state, dispatch, commit}, wallet ){

        let mainPublicKeyHash = state.mainPublicKeyHash || localStorage.getItem('mainPublicKeyHash') || null;

        let firstAddress;
        const addresses = {};
        for (let i=0; i < wallet.addresses.length; i++ ){

            const publicKeyHash = wallet.addresses[i].publicKeyHash
            const addr = {
                ...wallet.addresses[i],
                identicon: await Identicons.getIdenticon(publicKeyHash),
            };

            addresses[publicKeyHash] = addr;

            if (i === 0)
                firstAddress = publicKeyHash;
        }

        //localstorage
        if (mainPublicKeyHash && !addresses[mainPublicKeyHash])
            mainPublicKeyHash = null

        if (!mainPublicKeyHash && firstAddress )
            mainPublicKeyHash = firstAddress;

        commit('setWallet', { addresses, wallet, mainPublicKeyHash } );

    },

}
