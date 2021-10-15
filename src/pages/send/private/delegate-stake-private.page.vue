<template>

    <layout>

        <layout-title icon="fa fa-piggy-bank" title="Private Delegate Funds">Delegate Funds Privately to Delegating Address</layout-title>

        <zether-tx ref="refZetherTx"
                   :titles-offset="{ '-1': {icon: 'fas fa-edit', name: 'Delegation', tooltip: 'Delegation update' }}"
                   :init-available-assets="[PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX]"
                   tx-name="createZetherDelegateStakingTx" :public-key="publicKey" @onSetTab="setTab" @onBeforeProcess="handleBeforeProcess">

            <template :slot="`tab_${-1}`">
                <destination-address text="Delegate Address" asset="" @changed="changedDelegateDestination"/>
                <delegated-staking-new-info :public-key="delegatePublicKey" @onChanges="delegatedStakingNewInfoChanges" />
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
            delegatedStakingNewInfo: {},
            delegateDestination: {},
            delegatePublicKey: null,
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
        getAsset() {
            return this.$store.getters.getAsset(PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX);
        }
    },

    methods: {

        async setTab({resolve, reject, oldTab, value}){
            try{

                if (oldTab === 0.5 && value > oldTab){
                    if (this.delegateDestination.validationError) throw this.delegateDestination.validationError;
                    if (this.delegatedStakingNewInfo.validationDelegatedStakingNewPublicKey) throw this.delegatedStakingNewInfo.validationDelegatedStakingNewPublicKey

                    if ( this.delegatedStakingNewInfo.hasNewDelegatedInfo )
                        if ( !this.$store.getters('walletContains', this.delegatePublicKey ) ) throw "You need the Delegated Address in your wallet in case you update the public key"
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

        async handleBeforeProcess({resolve, reject, password, data }){

            try{

                if (this.delegatedStakingNewInfo.hasNewDelegatedInfo){
                    const out = await PandoraPay.wallet.getPrivateDataForDecodingBalanceWalletAddress( MyTextEncode(JSON.stringify({
                        publicKey: this.delegatePublicKey,
                        asset: ""
                    })), password, )

                    const params = JSON.parse( MyTextDecode( out ) )
                    if (!params.privateKey) throw "DelegatePublicKey is missing"

                    data.delegatePrivateKey = params.privateKey
                }else
                    data.delegatePrivateKey = ""


                data.delegatedStakingNewPublicKey = this.delegatedStakingNewInfo.delegatedStakingNewPublicKey
                data.delegatedStakingNewFee = this.delegatedStakingNewInfo.delegatedStakingNewFee
                data.delegateDestination = this.delegateDestination.addressEncoded

                const amount = Number.parseInt( await PandoraPay.config.assets.assetsConvertToUnits( this.delegateDestination.amount.toString(), this.getAsset.decimalSeparator ) )

                data.data.burns = [amount]

                resolve( true )
            }catch(err){
                reject(err)
            }

        }

    },

    mounted(){
    },

}

</script>

<style scoped>
</style>
