<template>

    <layout>

        <layout-title icon="fas fa-search-dollar" title="Private Claim">Claim funds from Unclaimed funds</layout-title>

        <zether-tx ref="refZetherTx"
                   :public-key="publicKey" @onSetTab="setTab" :beforeProcess="handleBeforeProcess"
                   :init-available-asset="PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64"
                   :init-available-balance="balancesOnlyUnclaimed"
                   :allow-recipient-zero-amount="false"
                   :validate-recipient-amount="true"
                   :create-new-sender="true"
                   text="Claim">
        </zether-tx>

    </layout>
</template>

<script>

import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title";
import ZetherTx from "src/components/send/txs/zether-tx";
import DelegatedStakingNewInfo from "src/components/staking/delegated-staking-new-info"
import Decimal from "decimal.js"

export default {

    components: { ZetherTx,  LayoutTitle, Layout, DelegatedStakingNewInfo },

    data(){
        return {
        }
    },

    props: {
    },

    computed: {
        PandoraPay: () => PandoraPay,
        publicKey(){
            return this.$store.state.wallet.mainPublicKey
        },
        walletAddress(){
            return this.$store.state.wallet.addresses[this.publicKey];
        },
        account(){
            return this.$store.state.accounts.list[this.publicKey]
        },
        balancesOnlyUnclaimed(){
            const amount = (this.account && this.account.plainAccount ) ? this.account.plainAccount.unclaimed : new Decimal(0)
            return { [PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64]: { amount: amount, asset: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64 } }
        },
        getAsset() {
            return this.$store.getters.getAsset(PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64);
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

            const out = await PandoraPay.wallet.getPrivateKeysWalletAddress( MyTextEncode( JSONStringify({
                publicKey: this.publicKey,
                asset: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64,
            })), password, )

            const params = JSONParse( MyTextDecode( out ) )
            if (!params.privateKey) throw "DelegatePrivateKey is missing"

            data.payloadExtra[0] = {
                delegatePrivateKey: params.privateKey
            }
            data.payloadScriptType[0] = PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_STAKING_REWARD

        }

    },

    mounted(){
    },

}

</script>

<style scoped>
</style>
