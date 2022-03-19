<template>
    <div>

        <div class="form-check pt-2">
            <input class="form-check-input" id="set-new-delegated-info" type="checkbox"  name="checkbox" v-model="hasNewDelegatedInfo"  >
            <label class="form-check-label" for="set-new-delegated-info">Set new Delegated Info</label>
            <i class="fas fa-question " v-tooltip.bottom="`Set new required keys to enable Delegated Staking`" />
        </div>

        <div v-if="hasNewDelegatedInfo" class="pt-2 ms-2">

            <div class="form-group pt-2">
                <loading-button text="Derive Delegated Stake" icon="fas fa-cogs" @submit="handleDeriveDelegatedStake" :disabled="!publicKey" />
            </div>

            <div class="form-group pt-2">
                <loading-button text="Select Node" icon="fas fa-laptop-code" @submit="handleShowDelegateStakeNode" :disabled="!publicKey" />
            </div>

            <div class="form pt-2">
                <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">New Delegated Stake Public Key:</label>
                <i class="fas fa-question " v-tooltip.bottom="`Public key of the delegated stake.`" />
                <input :class="`form-control ${validationDelegatedStakingNewPublicKey ? 'is-invalid' : ''}`" type="text" v-model="delegatedStakingNewPublicKey"  >
                <div v-if="validationDelegatedStakingNewPublicKey" class="invalid-feedback d-block">{{validationDelegatedStakingNewPublicKey}}</div>
            </div>

            <div class="form pt-2">
                <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">New Delegated Stake Fee:</label>
                <i class="fas fa-question " v-tooltip.bottom="`Public key of the delegator.`" />
                <input class="form-control" type="number" v-model.number="delegatedStakingNewFee" min="0" :max="PandoraPay.config.stake.DELEGATING_STAKING_FEE_MAX_VALUE" >
                <label>in Percentage: {{delegatedStakingNewFeePercentage}}%</label>
            </div>
        </div>

        <delegated-stake-node-modal ref="refDelegatedStakeNodeModal" />

    </div>
</template>

<script>
import DelegatedStakeNodeModal from "src/components/staking/delegated-stake-node.modal"
import LoadingButton from "src/components/utils/loading-button";
import Decimal from "decimal.js"

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
        PandoraPay: () => PandoraPay,

        walletAddress(){
            return this.$store.state.wallet.addresses[this.publicKey]
        },
        account(){
            return this.$store.state.accounts.list[this.publicKey]
        },

        validationDelegatedStakingNewPublicKey(){

            if (!this.hasNewDelegatedInfo ) return null

            try{
                const buffer = Buffer.from(this.delegatedStakingNewPublicKey, "base64")
                if (buffer.length !== 33) return "It must be 33 bytes"
            }catch(err){
                return "Invalid Base64 input"
            }

            return null
        },

        delegatedStakingNewFeePercentage(){
            return new Decimal(this.delegatedStakingNewFee).mul(100).div(PandoraPay.config.stake.DELEGATING_STAKING_FEE_MAX_VALUE ).toDecimalPlaces(3)
        }
    },

    methods:{

        async handleDeriveDelegatedStake(resolver){
            try{

                const password = await this.$store.state.page.refWalletPasswordModal.showModal()
                if (password === null ) return

                const nonceOut = await PandoraPay.network.getNetworkAccountMempoolNonce(MyTextEncode(JSONStringify({ publicKey: this.walletAddress.publicKey })))
                const nonce = JSONParse( MyTextDecode(nonceOut) ).nonce

                const out = await PandoraPay.wallet.deriveSharedStakedWalletAddress( nonce.toString(), this.walletAddress.addressEncoded, password )
                const json = JSONParse(MyTextDecode(out))

                this.hasNewDelegatedInfo = true
                this.delegatedStakingNewPublicKey = json.publicKey

            }finally{
                resolver(true)
            }
        },

        async handleShowDelegateStakeNode(resolver){
            resolver(true)
            const output = await this.$refs.refDelegatedStakeNodeModal.showModal(this.publicKey)
            if (output){
                this.hasNewDelegatedInfo = true
                this.delegatedStakingNewPublicKey = output.delegatedStakingPublicKey
                this.delegatedStakingNewFee = output.delegatedStakingFee
            }
        },

        getData(){
            return {
                hasNewDelegatedInfo: this.hasNewDelegatedInfo,
                delegatedStakingNewPublicKey: this.hasNewDelegatedInfo ? this.delegatedStakingNewPublicKey : "",
                delegatedStakingNewFee: this.hasNewDelegatedInfo ? this.delegatedStakingNewFee : new Decimal(0),
                validationDelegatedStakingNewPublicKey: this.hasNewDelegatedInfo ? this.validationDelegatedStakingNewPublicKey : "",
            }
        }
    }

}
</script>