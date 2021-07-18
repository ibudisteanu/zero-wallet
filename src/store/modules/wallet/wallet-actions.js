import Identicons from "src/utils/identicons"

export default {

    async readWallet( {state, dispatch, commit} ){

        commit('walletClear' );

        const walletData = await PandoraPay.wallet.getWallet()
        const wallet = JSON.parse( walletData )

        console.log("wallet received", wallet)

        commit('setWallet', wallet );

        await dispatch('readAddresses', wallet);

        const loaded = wallet.loaded

        commit('setInitialized', true );
        commit('setLoaded', loaded );

    },

    async readAddresses( {state, dispatch, commit}, wallet ){

        let mainPublicKeyHash = localStorage.getItem('mainPublicKeyHash') || null;

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
        if (mainPublicKeyHash && addresses[mainPublicKeyHash])
            commit('setMainPublicKeyHash', mainPublicKeyHash);

        if (state.mainPublicKeyHash && !addresses[state.mainPublicKeyHash])
            commit('setMainPublicKeyHash', null );

        if (!state.mainPublicKeyHash && firstAddress )
            commit('setMainPublicKeyHash', firstAddress );

        commit('addWalletAddresses', addresses );

    },

}
