<template>

    <modal ref="modal" title="Delegate Stake to Node" content-class="">

        <template slot="body" v-if="!isLoading && isFound">

            <wizzard :titles="[
                {icon: 'fas fa-globe-americas', name: 'Select Node', tooltip: 'Select Node you are delegating to' },
                {icon: 'fas fa-robot', name: 'Node Info', tooltip: 'Node information' },
                {icon: 'fas fa fa-piggy-bank', name: 'Delegate', tooltip: 'Finalizing the delegate' }]"
                     @setTab="setTab" controls-class-name="modal-footer bg-light" :buttons="buttons" >

                <template slot="tab_0">
                    <div class="form">
                        <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Selecting Node to delegate:</label>
                        <select class="form-select" v-model="selectedDelegateNode">
                            <option v-for="(node, id) in delegatesNodes"
                                    :key="`send-money-${id}`"
                                    :value="node">
                                {{node.name}} || {{delegateNodeAddress(node)}}
                            </option>
                        </select>
                    </div>
                </template>

                <template slot="tab_1" v-if="nodeInfo">
                    <label class="form-label">Delegates MAXIMUM slots: <strong>{{nodeInfo.maximumAllowed}}</strong></label> <br/>
                    <label class="form-label">Delegates Already: <strong>{{nodeInfo.delegatesCount}}</strong></label> <br/>
                    <label class="form-label">Delegates SLOTS: <strong>{{nodeInfo.maximumAllowed - nodeInfo.delegatesCount}}</strong></label> <br/>
                    <label class="form-label">Delegates Fee: <strong>{{nodeInfo.delegatesFee / 65535 * 100}}%</strong></label> <br/>
                </template>

            </wizzard>

        </template>


    </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import HttpHelper from "src/utils/http-helper"
import Wizzard from "src/components/utils/wizzard"
export default {

    components: {Modal, Wizzard},

    data() {
        return {

            publicKey: "",

            status: "",

            delegatesNodes: null,
            selectedDelegateNode: null,

            nodeInfo: null,
        }
    },

    computed:{

        address(){
            return this.$store.state.wallet.addresses[this.publicKey];
        },
        account(){
            return this.$store.state.accounts.list[this.publicKey]
        },
        isLoading(){
            return this.account === undefined
        },
        isFound(){
            return this.account !== null
        },
        buttons(){
            return { 1: { icon: 'fa fa-laptop-code', text: 'Stake to Node' }}
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
            this.delegatesNodes = JSON.parse( MyTextDecode( await PandoraPay.config.helpers.getNetworkSelectedDelegatesNodes() ) )
            return this.$refs.modal.showModal();
        },

        closeModal() {
            return this.$refs.modal.closeModal();
        },

        delegateNodeAddress(delegateNode){
            return `${delegateNode.url.Scheme.replace("ws","http")}://${delegateNode.url.Host}`
        },

        async handleConnectNode(){

            this.nodeInfo = null;

            const out = await HttpHelper.get(this.delegateNodeAddress( this.selectedDelegateNode ) +'/delegates/info', {} );
            if (!out) throw "Node is offline";

            if (typeof out.delegatesCount !== "number") throw "delegatesCount is missing"
            if (typeof out.maximumAllowed !== "number") throw "maximumAllowed is missing"
            if (typeof out.challenge !== "string" || out.challenge.length !== 64) throw "challenge is missing"
            if (typeof out.delegatesFee !== "number") throw "delegatesFee is missing"
            if (out.delegatesFee > 65535) throw "delegatesFee exceeded 65535"

            if (out.maximumAllowed <= out.delegatesCount) throw "Node is Full"

            this.nodeInfo = out;

        },

        async handleDelegateAsk(){

            if (!this.nodeInfo) throw "NodeInfo was not assigned"

            const password = await this.$store.state.page.refWalletPasswordModal.showModal()
            if (password === null ) return

            const signature = await PandoraPay.wallet.signMessageWalletAddress(this.nodeInfo.challenge, this.address.addressEncoded, password )

            const out = await HttpHelper.get(this.delegateNodeAddress( this.selectedDelegateNode ) +'/delegates/ask', {
                publicKey: this.address.publicKey,
                challengeSignature: signature,
            } );
            if (!out) throw "Node is offline";

            if (typeof out.exists !== "boolean") throw "exists is not a boolean"
            if (out.exists) throw "Your address already has been delegated"

            if (typeof out.delegateStakingPublicKey !== "string") throw "delegateStakingPublicKey is missing"

            const promise = new Promise((resolver, reject )=>{
                this.$emit('onDelegateStake', {
                    delegateStakingPublicKey: out.delegateStakingPublicKey,
                    delegatesFee: this.nodeInfo.delegatesFee,
                    resolver,
                    reject,
                } )
            })

            await promise

        },

    },

}
</script>

<style scoped>
</style>
