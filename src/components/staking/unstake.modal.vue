<template>

    <simple-tx-modal ref="refModal" :tabs-offset="1" title="Unstake tx"
                :titlesOffset="[ {icon: 'fas fa-edit', name: 'Amount', tooltip: 'Unstaking amount' }]"
                :tx-data="txData" @onSetTab="setTab" >

        <template slot="tab_0">
            <tx-amount :allow-zero="true" :accounts="balancesStakeAvailable" @changed="amountChanged" text="Amount to unstake" :asset="''" :validate-amount="true" />
        </template>

    </simple-tx-modal>

</template>

<script>
import TxAmount from "src/components/send/tx-amount"
import SimpleTxModal from "src/components/send/txs/simple-tx.modal"

export default {

    components: {SimpleTxModal, TxAmount},

    data(){
        return {
            publicKey: "",
            unstakeAmount: {},
        }
    },

    computed:{
        address(){
            return this.$store.state.wallet.addresses[this.publicKey];
        },
        account(){
            return this.$store.state.accounts.list[this.publicKey]
        },
        balancesStakeAvailable(){
            return (this.account && this.account.plainAccount && this.account.plainAccount.delegatedStake) ? [{ amount: this.account.plainAccount.delegatedStake.stakeAvailable, asset: ""}] : [{ amount: 0, asset: ""}]
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

        showModal( publicKey ) {
            Object.assign(this.$data, this.$options.data());
            this.publicKey = publicKey;
            return this.$refs.refModal.showModal(...arguments);
        },

        closeModal() {
            return this.$refs.refModal.closeModal();
        },

    },

}
</script>

<style scoped>

</style>
