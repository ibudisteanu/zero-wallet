<template>

    <modal ref="modal" title="Delegate Stake to Node" content-class="">

        <template v-slot:body>
            <wait-address :address="walletAddress">
                <wizard :titles="{
                         0: {icon: 'fas fa-globe-americas', name: 'Select Node', tooltip: 'Select Node you are delegating to' },
                         1: {icon: 'fas fa-robot', name: 'Node Info', tooltip: 'Node information' },
                         2: {icon: 'fas fa-piggy-bank', name: 'Delegate', tooltip: 'Finalizing the delegate' }}"
                         @onSetTab="setTab" controls-class-name="modal-footer bg-light" :buttons="buttons" :allow-scroll="false" >

                    <template v-slot:tab_0>
                        <div class="form">
                            <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Selecting Node to delegate:</label>
                            <select v-if="delegatesNodes" class="form-select" v-model="selectedDelegateNode">
                                <option v-for="(node, id) in delegatesNodes"
                                        :key="`send-money-${id}`"
                                        :value="id">
                                    {{node.name}} || {{delegateNodeAddress(id)}}
                                </option>
                            </select>
                        </div>
                    </template>

                    <template v-slot:tab_1 v-if="nodeInfo">

                        <label class="form-label">Chain Blocks: <strong>{{nodeInfo.blocks}}</strong></label> <br/>
                        <label class="form-label">Delegates MAXIMUM slots: <strong>{{nodeInfo.maximumAllowed}}</strong></label> <br/>
                        <label class="form-label">Delegates Already: <strong>{{nodeInfo.delegatesCount}}</strong></label> <br/>
                        <label class="form-label">Delegates SLOTS: <strong>{{nodeInfo.maximumAllowed.minus( nodeInfo.delegatesCount ) }}</strong></label> <br/>
                        <label class="form-label">Delegator Fee: <strong>{{nodeInfo.delegatorFee.div( PandoraPay.config.stake.DELEGATING_STAKING_FEE_MAX_VALUE ).mul( 100 )}}%</strong></label> <br/>
                        <label class="form-label">Accept Custom Keys: <strong>{{nodeInfo.acceptCustomKeys ? 'YES': 'NO'}}</strong></label> <br/>

                        <div class="form-group pt-2">
                            <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Optional - New Delegated Stake Private Key:</label>
                            <i class="fas fa-question " v-tooltip.bottom="`Delegated Stake Private Key to be shared with the node.`" />
                            <input :disabled="!nodeInfo.acceptCustomKeys" :class="`form-control ${validationDelegatedStakingNewPrivateKey ? 'is-invalid' : ''}`" type="text" v-model="delegatedStakingNewPrivateKey"  >
                            <div v-if="validationDelegatedStakingNewPrivateKey" class="invalid-feedback d-block">{{validationDelegatedStakingNewPrivateKey}}</div>
                        </div>

                        <div class="form-group pt-2">
                            <loading-button :disabled="!nodeInfo.acceptCustomKeys" text="Optional Derive Delegated Stake" icon="fas fa-cogs" @submit="handleDeriveDelegatedStake"/>
                        </div>

                    </template>

                </wizard>
            </wait-address>
        </template>

    </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import HttpHelper from "src/utils/http-helper"
import Wizard from "src/components/utils/wizard"
import WaitAddress from "src/components/wallet/account/wait-address";
import Decimal from "decimal.js"
import LoadingButton from "src/components/utils/loading-button"

export default {

    components: {Modal, Wizard, WaitAddress, LoadingButton},

    data() {
        return {
            publicKey: "",

            delegatesNodes: null,
            selectedDelegateNode: null,

            nodeInfo: null,

            delegatedStakingNewPrivateKey: "",

            output: null,
        }
    },

    computed:{
        PandoraPay: () => PandoraPay,

        walletAddress(){
            return this.$store.state.wallet.addresses[this.publicKey];
        },
        account(){
            return this.$store.state.accounts.list[this.publicKey]
        },
        buttons(){
            return { 1: { icon: 'fas fa-laptop-code', text: 'Stake to Node' }}
        },

        validationDelegatedStakingNewPrivateKey(){

            if ( !this.nodeInfo || !this.nodeInfo.acceptCustomKeys || !this.delegatedStakingNewPrivateKey ) return null

            try{
                const buffer = Buffer.from(this.delegatedStakingNewPrivateKey, "hex")
                if (buffer.length !== 32) return "It must be 64 hex"
            }catch(err){
                return "Invalid Hex input"
            }

            return null
        },
    },

    methods: {

        async setTab({resolve, reject, oldTab, value}){
            try{

                if (oldTab === 0 && value === 1)
                    await this.handleConnectNode()

                if (oldTab === 1 && value === 2) {
                    if (this.validationDelegatedStakingNewPrivateKey) throw this.validationDelegatedStakingNewPrivateKey
                    await this.handleDelegateAsk()
                }

            }catch(err) {
                reject(err)
            }finally{
                resolve(true)
            }
        },

        async showModal(publicKey) {
            Object.assign(this.$data, this.$options.data());
            this.publicKey = publicKey
            this.delegatesNodes = JSONParse( MyTextDecode( await PandoraPay.config.helpers.getNetworkSelectedDelegatesNodes() ) )
            await this.$refs.modal.showModal();

            return this.output
        },

        closeModal() {
            return this.$refs.modal.closeModal();
        },

        delegateNodeAddress(delegateNodeIndex){
            return this.delegatesNodes[delegateNodeIndex].url.replace("ws","http").replace("/ws", "")
        },

        async handleConnectNode(){

            this.nodeInfo = null;
            let out

            if ( this.selectedDelegateNode === null ) throw "You need to select a node"

            try{
                out = await HttpHelper.get(this.delegateNodeAddress( this.selectedDelegateNode ) +'/ping' );
            }catch(err){
                throw "Node is offline";
            }

            if (!out || out.ping !== "pong") throw "Invalid ping answer"

            try{
                out = await HttpHelper.get(this.delegateNodeAddress( this.selectedDelegateNode ) +'/delegator-node/info' );
            }catch(err){
                throw "Node is not configured to receive delegates";
            }

            if (!out) throw "Node did not answer";

            console.log(out)

            if (!(out.delegatesCount instanceof Decimal) ) throw "delegatesCount is missing"
            if (!(out.maximumAllowed instanceof Decimal) ) throw "maximumAllowed is missing"
            if (typeof out.challenge !== "string" || out.challenge.length !== 64) throw "challenge is missing"
            if (!(out.delegatorFee instanceof Decimal) ) throw "delegatorFee is missing"
            if (out.delegatorFee.lt(0) || out.delegatorFee.gt(PandoraPay.config.stake.DELEGATING_STAKING_FEE_MAX_VALUE)) throw "delegatorFee exceeded 100000"

            if (out.maximumAllowed.lte( out.delegatesCount) ) throw "Node is Full"
            if (typeof out.acceptCustomKeys !== "boolean" ) throw "acceptCustomKeys is invalid"

            this.nodeInfo = out;

        },

        async handleDeriveDelegatedStake(resolver){
            try{

                const password = await this.$store.state.page.refWalletPasswordModal.showModal()
                if (password === null ) return

                const nonceOut = await PandoraPay.network.getNetworkAccountMempoolNonce(MyTextEncode(JSONStringify({ publicKey: this.walletAddress.publicKey })))
                const nonce = JSONParse( MyTextDecode(nonceOut) ).nonce

                const out = await PandoraPay.wallet.deriveDelegatedStakeWalletAddress( nonce.toString(), this.walletAddress.addressEncoded, password )
                const json = JSONParse(MyTextDecode(out))

                this.delegatedStakingNewPrivateKey = json.privateKey.key

            }finally{
                resolver(true)
            }
        },

        async handleDelegateAsk(){

            if (!this.nodeInfo) throw "NodeInfo was not assigned"

            const password = await this.$store.state.page.refWalletPasswordModal.showModal()
            if (password === null ) return

            const signature = await PandoraPay.wallet.signMessageWalletAddress(this.nodeInfo.challenge, this.walletAddress.addressEncoded, password )

            const out = await HttpHelper.get(this.delegateNodeAddress( this.selectedDelegateNode ) +'/delegator-node/ask', {
                delegatedStakingPrivateKey: (this.nodeInfo.acceptCustomKeys && this.delegatedStakingNewPrivateKey) ? this.delegatedStakingNewPrivateKey : "",
                publicKey: this.walletAddress.publicKey,
                challengeSignature: signature,
            } );
            if (!out) throw "Node is offline";

            if (typeof out.exists !== "boolean") throw "exists is not a boolean"
            if (out.exists)
                throw `Your address already has been delegated to this node.`

            this.output = {
                delegatedStakingFee: this.nodeInfo.delegatorFee,
            }

            if (this.nodeInfo.acceptCustomKeys && this.delegatedStakingNewPrivateKey){
                const json = JSONParse( MyTextDecode( await PandoraPay.addresses.generateAddress(this.delegatedStakingNewPrivateKey) ) )
                this.output.delegatedStakingPublicKey = json[2]
                this.output.delegatedStakingPrivateKey = this.delegatedStakingNewPrivateKey
            }else {
                if (typeof out.delegatedStakingPublicKey !== "string") throw "delegateStakingPublicKey is missing"
                this.output.delegatedStakingPublicKey = out.delegatedStakingPublicKey
            }

            this.closeModal()
        },

    },

}
</script>

<style scoped>
</style>
