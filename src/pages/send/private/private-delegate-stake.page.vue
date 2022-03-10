<template>

    <layout>

        <layout-title icon="fas fa-seedling" title="Private Delegate Funds">Delegate Funds Privately to Delegating Address</layout-title>

        <zether-tx ref="refZetherTx"
                   :titles-offset="{ '-1': {icon: 'fas fa-edit', name: 'Delegate Stake', tooltip: 'Delegate your Stake' }}"
                   :public-key="publicKey" @onSetTab="setTab" :beforeProcess="handleBeforeProcess"
                   :allow-random-recipient="true"
                   :validate-recipient-amount="true"
                   :init-available-asset="PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64"
                   @onBroadcast="broadcastTx">

            <template v-slot:tab_-1>
                <tx-recipient text="Delegate" :init-available-asset="PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64" @changed="changedDelegateRecipient"/>
                <div class="form-check pt-3">
                    <input class="form-check-input" id="convert-to-unclaimed" type="checkbox"  name="checkbox" v-model="convertToUnclaimed"  >
                    <label class="form-check-label" for="convert-to-unclaimed">Convert to Unclaimed instead of Staking</label> <i class="fas fa-question " v-tooltip.bottom="`Instead of staking, you deposit to the unclaimed amount`" />
                </div>
                <delegated-staking-new-info class="pt-3" :public-key="delegatePublicKey" ref="refDelegatedStakingNewInfo" />
            </template>

        </zether-tx>

    </layout>
</template>

<script>

import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title";
import ZetherTx from "src/components/send/txs/zether-tx";
import DelegatedStakingNewInfo from "src/components/staking/delegated-staking-new-info"
import TxRecipient from "src/components/send/tx-recipient";

export default {

    components: { ZetherTx,  LayoutTitle, Layout, DelegatedStakingNewInfo, TxRecipient },

    data(){
        return {
            hasNewDelegatedInfo: false,
            convertToUnclaimed: false,
            delegatedStakingNewInfo: {},
            delegateRecipient: {
                address: null,
                addressEncoded: "",
                addressValidationError: "",
                amount: 0,
                amountValidationError: "",
            },
            delegatePublicKey: null,
        }
    },

    props: {
    },

    computed: {
        PandoraPay: () => PandoraPay,

        publicKey(){
            return this.$store.state.wallet.mainPublicKey
        },
    },

    methods: {

        async setTab({resolve, reject, oldTab, value}){
            try{

                if (oldTab === -1 && value > oldTab){

                    if (this.delegateRecipient.addressValidationError) throw this.delegateRecipient.addressValidationError;
                    if (this.delegateRecipient.amountValidationError) throw this.delegateRecipient.amountValidationError;

                    this.delegatedStakingNewInfo = this.$refs.refDelegatedStakingNewInfo.getData()
                    if (this.delegatedStakingNewInfo.validationDelegatedStakingNewPublicKey) throw this.delegatedStakingNewInfo.validationDelegatedStakingNewPublicKey

                    if ( this.delegatedStakingNewInfo.hasNewDelegatedInfo )
                        if ( !this.$store.getters.walletContains( this.delegatePublicKey ) ) throw "You need the Delegated Address in your wallet in case you update the public key"
                }

            }catch(err) {
                reject(err)
            }finally{
                resolve(true)
            }
        },

        changedDelegateRecipient(data){
            this.delegateRecipient = { ...this.delegateRecipient,  ...data, }
            this.delegatePublicKey = (this.delegateRecipient && this.delegateRecipient.address) ? this.delegateRecipient.address.publicKey : ""
        },

        async handleBeforeProcess( password, data ){

            const payloadExtra = {
                delegatePrivateKey: ""
            }

            if (this.delegatedStakingNewInfo.hasNewDelegatedInfo){
                const out = await PandoraPay.wallet.getPrivateDataForDecryptingBalanceWalletAddress( MyTextEncode( JSONStringify({
                    publicKey: this.delegatePublicKey,
                    asset: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64,
                })), password, )

                const params = JSONParse( MyTextDecode( out ) )
                if (!params.privateKey) throw "DelegatePrivateKey is missing"

                payloadExtra.delegatePrivateKey = params.privateKey
            }

            payloadExtra.delegatePublicKey = this.delegatePublicKey
            payloadExtra.convertToUnclaimed = this.convertToUnclaimed;
            payloadExtra.delegatedStakingUpdate = {
                delegatedStakingHasNewInfo: this.delegatedStakingNewInfo.hasNewDelegatedInfo,
                delegatedStakingNewPublicKey: this.delegatedStakingNewInfo.delegatedStakingNewPublicKey,
                delegatedStakingNewFee: this.delegatedStakingNewInfo.delegatedStakingNewFee,
            }

            data.burns = [ this.delegateRecipient.amount ]
            data.payloadExtra[0] = payloadExtra
            data.payloadScriptType[0] = PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_STAKING

        },

        broadcastTx({tx}){

        }

    },

    mounted(){
    },

}

</script>

<style scoped>
</style>
