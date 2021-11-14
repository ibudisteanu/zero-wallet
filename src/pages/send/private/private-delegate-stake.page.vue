<template>

    <layout>

        <layout-title icon="fa fa-seedling" title="Private Delegate Funds">Delegate Funds Privately to Delegating Address</layout-title>

        <zether-tx ref="refZetherTx"
                   :titles-offset="{ '-1': {icon: 'fas fa-edit', name: 'Delegation', tooltip: 'Delegation update' }}"
                   :allow-destination-random="true"
                   :validate-destination-amount="true"
                   :init-available-asset="PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX"
                   :public-key="publicKey" @onSetTab="setTab" :beforeProcess="handleBeforeProcess">

            <template :slot="`tab_${-1}`">
                <destination-address text="Delegate Address" @changed="changedDelegateDestination"/>
                <div class="form-group pt-3">
                    <input class="form-check-input" id="convert-to-unclaimed" type="checkbox"  name="checkbox" v-model="convertToUnclaimed"  >
                    <label class="form-check-label" for="convert-to-unclaimed">Convert to Unclaimed instead of Staking</label> <i class="fa fa-question " v-tooltip.bottom="`Instead of staking, you deposit to the unclaimed amount`" />
                </div>
                <delegated-staking-new-info class="pt-3" :public-key="delegatePublicKey" @onChanges="delegatedStakingNewInfoChanges" />
            </template>

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
            hasNewDelegatedInfo: false,
            convertToUnclaimed: false,
            delegatedStakingNewInfo: {},
            delegateDestination: {},
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
        getAsset() {
            return this.$store.getters.getAsset(PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX);
        }
    },

    methods: {

        async setTab({resolve, reject, oldTab, value}){
            try{

                if (oldTab === -1 && value > oldTab){
                    if (this.delegateDestination.validationError) throw this.delegateDestination.validationError;
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

        changedDelegateDestination(data){
            this.delegateDestination = { ...this.delegateDestination,  ...data, }
            this.delegatePublicKey = (this.delegateDestination && this.delegateDestination.address) ? this.delegateDestination.address.publicKey : ""
        },

        delegatedStakingNewInfoChanges(data){
            this.delegatedStakingNewInfo = {
                ...this.delegatedStakingNewInfo,
                ...data
            }
        },

        async handleBeforeProcess( password, data ){

            const payloadExtra = {
                delegatePrivateKey: ""
            }

            if (this.delegatedStakingNewInfo.hasNewDelegatedInfo){
                const out = await PandoraPay.wallet.getPrivateDataForDecodingBalanceWalletAddress( MyTextEncode(JSON.stringify({
                    publicKey: this.delegatePublicKey,
                    asset: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX,
                })), password, )

                const params = JSON.parse( MyTextDecode( out ) )
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

            const amount = Number.parseInt( await PandoraPay.config.assets.assetsConvertToUnits( this.delegateDestination.amount.toString(), this.getAsset.decimalSeparator ) )
            data.burns = [amount]
            data.payloadExtra[0] = payloadExtra
            data.payloadScriptType[0] = PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_DELEGATE_STAKE

        }

    },

    mounted(){
    },

}

</script>

<style scoped>
</style>
