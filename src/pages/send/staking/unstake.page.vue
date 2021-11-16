<template>

    <layout>

        <layout-title icon="fa fa-unlink" title="Unstake coins">Retrieve coins from the staking balance</layout-title>

        <simple-tx :titles-offset="{ '-1': {icon: 'fas fa-edit', name: 'Amount', tooltip: 'Unstaking amount' } }"
                @onSetTab="setTab" :buttons-offset="buttons" :public-key="publicKey" :before-process="handleBeforeProcess">

            <template slot="tab_-1">
                <tx-amount :balances="balancesStakeAvailable" @changed="amountChanged" text="Amount to unstake" :validate-amount="true" />
            </template>

        </simple-tx>

    </layout>

</template>

<script>
import TxAmount from "src/components/send/tx-amount"
import SimpleTx from "src/components/send/txs/simple-tx"
import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title"
export default {

    components: {SimpleTx, TxAmount, Layout, LayoutTitle},

    data(){
        return {
            unstakeAmount: {},
        }
    },

    computed:{
        publicKey(){
            return this.$store.state.wallet.mainPublicKey
        },
        account(){
            return this.$store.state.accounts.list[this.publicKey]
        },
        balancesStakeAvailable(){
            const amount = (this.account && this.account.plainAccount && this.account.plainAccount.delegatedStake) ? this.account.plainAccount.delegatedStake.stakeAvailable : 0
            return { [PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX]: {amount, asset: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX } }
        },
        buttons(){
            return { 1: { icon: 'fa fa-unlink', text: 'Unstake now' }}
        },
        getAsset() {
            return this.$store.getters.getAsset(PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX);
        },
    },

    methods:{

        async setTab({resolve, reject, oldTab, value}){
            try{

                if (oldTab === -1 && value === 0 )
                    if (this.unstakeAmount.validationError) throw this.unstakeAmount.validationError

            }catch(err) {
                reject(err)
            }finally{
                resolve(true)
            }
        },

        amountChanged(data){
            this.unstakeAmount = {...this.unstakeAmount, ...data}
        },


        async handleBeforeProcess(password, data){

            const amount = Number.parseInt( await PandoraPay.config.assets.assetsConvertToUnits( this.unstakeAmount.amount.toString(), this.getAsset.decimalSeparator ) )
            data.extra = {
                amount: amount
            }
            data.txScript = PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UNSTAKE

        }

    },

}
</script>
