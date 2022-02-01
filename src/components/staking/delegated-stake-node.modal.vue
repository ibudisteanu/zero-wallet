<template>

    <modal ref="modal" title="Delegate Stake to Node" content-class="">

        <template slot="body">
            <wait-address :address="address">
                <wizard :titles="{
                         0: {icon: 'fas fa-globe-americas', name: 'Select Node', tooltip: 'Select Node you are delegating to' },
                         1: {icon: 'fas fa-robot', name: 'Node Info', tooltip: 'Node information' },
                         2: {icon: 'fas fa-piggy-bank', name: 'Delegate', tooltip: 'Finalizing the delegate' }}"
                         @onSetTab="setTab" controls-class-name="modal-footer bg-light" :buttons="buttons" >

                    <template slot="tab_0">
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

                    <template slot="tab_1" v-if="nodeInfo">
                        <label class="form-label">Delegates MAXIMUM slots: <strong>{{nodeInfo.maximumAllowed}}</strong></label> <br/>
                        <label class="form-label">Delegates Already: <strong>{{nodeInfo.delegatesCount}}</strong></label> <br/>
                        <label class="form-label">Delegates SLOTS: <strong>{{nodeInfo.maximumAllowed.minus( nodeInfo.delegatesCount ) }}</strong></label> <br/>
                        <label class="form-label">Delegates Fee: <strong>{{nodeInfo.delegatesFee.div( 65535 ).mul( 100 )}}%</strong></label> <br/>
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

export default {

    components: {Modal, Wizard, WaitAddress},

    data() {
        return {
            publicKey: "",

            delegatesNodes: null,
            selectedDelegateNode: null,

            nodeInfo: null,

            output: null,
        }
    },

    computed:{
        address(){
            return this.$store.state.wallet.addresses[this.publicKey];
        },
        account(){
            return this.$store.state.accounts.list[this.publicKey]
        },
        buttons(){
            return { 1: { icon: 'fas fa-laptop-code', text: 'Stake to Node' }}
        }
    },

    methods: {

        async setTab({resolve, reject, oldTab, value}){
            try{

                if (oldTab === 0 && value === 1)
                    await this.handleConnectNode()

                if (oldTab === 1 && value === 2)
                    await this.handleDelegateAsk()

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

            if (out.delegatesCount instanceof Decimal === false ) throw "delegatesCount is missing"
            if (out.maximumAllowed  instanceof Decimal === false ) throw "maximumAllowed is missing"
            if (typeof out.challenge !== "string" || out.challenge.length !== 64) throw "challenge is missing"
            if (out.delegatesFee  instanceof Decimal === false ) throw "delegatesFee is missing"
            if (out.delegatesFee.lt(0) || out.delegatesFee.gt(65535)) throw "delegatesFee exceeded 65535"

            if (out.maximumAllowed.lte( out.delegatesCount) ) throw "Node is Full"

            this.nodeInfo = out;

        },

        async handleDelegateAsk(){

            if (!this.nodeInfo) throw "NodeInfo was not assigned"

            const password = await this.$store.state.page.refWalletPasswordModal.showModal()
            if (password === null ) return

            const signature = await PandoraPay.wallet.signMessageWalletAddress(this.nodeInfo.challenge, this.address.addressEncoded, password )

            const out = await HttpHelper.get(this.delegateNodeAddress( this.selectedDelegateNode ) +'/delegator-node/ask', {
                publicKey: this.address.publicKey,
                challengeSignature: signature,
            } );
            if (!out) throw "Node is offline";

            if (typeof out.exists !== "boolean") throw "exists is not a boolean"
            if (out.exists) throw "Your address already has been delegated"

            if (typeof out.delegateStakingPublicKey !== "string") throw "delegateStakingPublicKey is missing"

            this.output = {
                delegateStakingPublicKey: out.delegateStakingPublicKey,
                delegatesStakingFee: this.nodeInfo.delegatesFee
            }

            this.closeModal()
        },

    },

}
</script>

<style scoped>
</style>
