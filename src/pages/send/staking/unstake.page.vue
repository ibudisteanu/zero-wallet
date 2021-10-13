<template>

    <layout>

        <layout-title icon="fa fa-unlink" title="Unstake coins">Retrieve coins from the staking balance</layout-title>

        <simple-tx :tabs-offset="1" :titles-offset="[ {icon: 'fas fa-edit', name: 'Amount', tooltip: 'Unstaking amount' }]"
                :tx-data="txData" @onSetTab="setTab" :buttonsOffset="buttons"
                tx-name="createUnstakeTx_Float">

            <template slot="tab_0">
                <tx-amount :balances="balancesStakeAvailable" @changed="amountChanged" text="Amount to unstake" :asset="''" :validate-amount="true" />
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
            return (this.account && this.account.plainAccount && this.account.plainAccount.delegatedStake) ?  { "": { amount: this.account.plainAccount.delegatedStake.stakeAvailable, asset: ""} } : { amount: 0, asset: ""}
        },
        buttons(){
            return { 2: { icon: 'fa fa-unlink', text: 'Unstake now' }}
        },
        txData(){
            return {
                unstakeAmount: this.unstakeAmount.amount,
            }
        }
    },

    methods:{

        async setTab({resolve, reject, oldTab, value}){
            try{

                if (oldTab === 0 && value === 1)
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

    },

}
</script>
