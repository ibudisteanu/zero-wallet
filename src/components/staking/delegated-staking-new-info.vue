<template>
    <div>

        <div class="form-group pt-2">
            <input class="form-check-input" id="set-new-delegated-info" type="checkbox"  name="checkbox" v-model="hasNewDelegatedInfo"  >
            <label class="form-check-label" for="set-new-delegated-info" >Set new Delegated Info</label>
        </div>

        <div v-if="hasNewDelegatedInfo" class="pt-2 ms-2">

            <div class="form-group pt-2">
                <loading-button text="Auto Generate Public Key Hash" icon="fa fa-cogs" @submit="handleDeriveDelegatedStake" :disabled="!publicKey" />
            </div>

            <div class="form-group pt-2">
                <loading-button text="Select Node" icon="fa fa-laptop-code" @submit="handleShowDelegateStakeNode" :disabled="!publicKey" />
            </div>

            <div class="form pt-2">
                <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">New Delegated Stake Public Key:</label>
                <i class="fa fa-question " v-tooltip.bottom="`Public key of the delegator.`" />
                <input :class="`form-control ${validationDelegatedStakingNewPublicKey ? 'is-invalid' : ''}`" type="text" v-model="delegatedStakingNewPublicKey"  >
                <div v-if="validationDelegatedStakingNewPublicKey" class="invalid-feedback d-block">{{validationDelegatedStakingNewPublicKey}}</div>
            </div>

            <div class="form pt-2">
                <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">New Delegated Stake Fee:</label>
                <i class="fa fa-question " v-tooltip.bottom="`Public key of the delegator.`" />
                <input class="form-control" type="number" v-model="delegatedStakingNewFee" min="0" max="65535" >
                <label>in Percentage: {{delegatedStakingNewFee/65535*100}}%</label>
            </div>
        </div>

        <delegated-stake-node-modal ref="refDelegatedStakeNodeModal" />

    </div>
</template>

<script>
import DelegatedStakeNodeModal from "src/components/staking/delegated-stake-node.modal"
import LoadingButton from "src/components/utils/loading-button";

export default {
    components: {DelegatedStakeNodeModal, LoadingButton},

    data(){
        return {
            hasNewDelegatedInfo: false,
            delegatedStakingNewPublicKey: "",
            delegatedStakingNewFee: 0,
        }
    },

    props: {
        publicKey: {default: ""},
    },

    computed:{
        address(){
            return this.$store.state.wallet.addresses[this.publicKey]
        },
        account(){
            return this.$store.state.accounts.list[this.publicKey]
        },
        validationDelegatedStakingNewPublicKey(){

            if (!this.hasNewDelegatedInfo) return null

            try{
                const buffer = Buffer.from(this.delegatedStakingNewPublicKey, "hex")
                if (buffer.length !== 33) return "It must be 66 hex"
            }catch(err){
                return "Invalid Hex input"
            }

            return null
        },
    },

    watch: {
        hasNewDelegatedInfo:{
            immediate: true,
            handler: function  (to, from) {
                const obj = { hasNewDelegatedInfo: to }
                if (!to){
                    obj.delegatedStakingNewPublicKey = ""
                    obj.delegatedStakingNewFee = 0
                    obj.validationDelegatedStakingNewPublicKey = ""
                }
                this.$emit('onChanges', obj )
            }
        },
        delegatedStakingNewPublicKey:{
            immediate: true,
            handler: function (to, from) {
                this.$emit('onChanges', { delegatedStakingNewPublicKey: to })
            }
        },
        delegatedStakingNewFee:{
            immediate: true,
            handler: function (to, from) {
                this.$emit('onChanges', { delegatedStakingNewFee: Number.parseInt(to) })
            }
        },
        validationDelegatedStakingNewPublicKey:{
            immediate: true,
            handler: function (to, from) {
                this.$emit('onChanges', { validationDelegatedStakingNewPublicKey: to })
            }
        },
    },

    methods:{
        async handleDeriveDelegatedStake(resolver){
            try{

                const password = await this.$store.state.page.refWalletPasswordModal.showModal()
                if (password === null ) return

                const nonce = this.account && this.account.plainAccount ? this.account.plainAccount.nonce : 0

                const out = await PandoraPay.wallet.deriveDelegatedStakeWalletAddress( nonce.toString(), this.address.addressEncoded, password )
                const json = JSON.parse(MyTextDecode(out))

                this.hasNewDelegatedInfo = true
                this.delegatedStakingNewPublicKey = json.publicKey

            }finally{
                resolver(true)
            }
        },

        async handleShowDelegateStakeNode(resolver){
            try{
                const output = await this.$refs.refDelegatedStakeNodeModal.showModal(this.publicKey)
                if (output){
                    this.hasNewDelegatedInfo = true
                    this.delegatedStakingNewPublicKey = output.delegateStakingPublicKey
                    this.delegatedStakingNewFee = output.delegatesFee
                }
            }finally{
                resolver(true)
            }
        },

    }

}
</script>