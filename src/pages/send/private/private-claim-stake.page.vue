<template>

    <layout>

        <layout-title icon="fa fa-search-dollar" title="Private Claim Stake">Claim funds from Unclaimed Stakes</layout-title>

        <zether-tx ref="refZetherTx"
                   :init-available-asset="PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX"
                   :init-available-balance="balancesOnlyUnclaimed"
                   :allow-destination-zero-amount="false"
                   :validate-destination-amount="true"
                   :create-new-sender="true"
                   text="Claim"
                   tx-name="createZetherClaimStakeTx" :public-key="publicKey" @onSetTab="setTab" :beforeProcess="handleBeforeProcess">
        </zether-tx>

    </layout>
</template>

<script>

import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title";
import ZetherTx from "src/components/send/txs/zether-tx";
import DelegatedStakingNewInfo from "src/components/staking/delegated-staking-new-info"
import DestinationAddress from "src/components/send/destination-address";

export default {

    components: { ZetherTx,  LayoutTitle, Layout, DelegatedStakingNewInfo, DestinationAddress },

    data(){
        return {
        }
    },

    props: {
    },

    computed: {
        PandoraPay() {
            return PandoraPay
        },
        publicKey(){
            return this.$store.state.wallet.mainPublicKey
        },
        address(){
            return this.$store.state.wallet.addresses[this.publicKey];
        },
        account(){
            return this.$store.state.accounts.list[this.publicKey]
        },
        balancesOnlyUnclaimed(){
            const amount = (this.account && this.account.plainAccount ) ? this.account.plainAccount.unclaimed : 0
            return { [PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX]: { amount: amount, asset: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX } }
        },
        getAsset() {
            return this.$store.getters.getAsset(PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX);
        },
    },

    methods: {

        async setTab({resolve, reject, oldTab, value}){
            try{

            }catch(err) {
                reject(err)
            }finally{
                resolve(true)
            }
        },

        async handleBeforeProcess(password, data){

            const out = await PandoraPay.wallet.getPrivateDataForDecodingBalanceWalletAddress( MyTextEncode(JSON.stringify({
                publicKey: this.publicKey,
                asset: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX,
            })), password, )

            const params = JSON.parse( MyTextDecode( out ) )
            if (!params.privateKey) throw "DelegatePrivateKey is missing"

            data.delegatePrivateKey = params.privateKey

        }

    },

    mounted(){
    },

}

</script>

<style scoped>
</style>
