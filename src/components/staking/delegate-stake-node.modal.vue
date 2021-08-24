<template>

    <modal ref="modal" title="Delegate Stake to Node" content-class="">

        <template slot="body">

            <alert-box v-if="!isLoading && !isFound" type="warning" >
                Address doesn't exist (is empty)!
            </alert-box>
            <template v-else>

                <div class="card theme-wizard">
                    <div class="card-header bg-light py-3">
                        <ul class="nav justify-content-between nav-wizard">
                            <li class="nav-item">
                                <span :class="`nav-link ${tab===0?'active':''} fw-semi-bold`">
                                    <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-users"></i></span></span>
                                    <span class="d-none d-md-block mt-1 fs--1">Select Node</span>
                                </span>
                            </li>
                            <li class="nav-item">
                                <span :class="`nav-link ${tab===1?'active':''} fw-semi-bold`">
                                    <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-pen"></i></span></span>
                                    <span class="d-none d-md-block mt-1 fs--1">Node Info</span>
                                </span>
                            </li>
                            <li class="nav-item">
                                <span :class="`nav-link ${tab===2?'active':''} fw-semi-bold`">
                                    <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-pen"></i></span></span>
                                    <span class="d-none d-md-block mt-1 fs--1">Delegate</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body py-3">
                        <div class="tab-content">
                            <div :class="`tab-pane ${tab===0?'active':''} `">

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

                            </div>
                            <div :class="`tab-pane ${tab===1?'active':''} `">
                                <template v-if="nodeInfo">
                                    <label class="form-label">Delegates MAXIMUM slots: <strong>{{nodeInfo.maximumAllowed}}</strong></label> <br/>
                                    <label class="form-label">Delegates Already: <strong>{{nodeInfo.delegatesCount}}</strong></label> <br/>
                                    <label class="form-label">Delegates SLOTS: <strong>{{nodeInfo.maximumAllowed - nodeInfo.delegatesCount}}</strong></label> <br/>
                                    <label class="form-label">Delegates Fee: <strong>{{nodeInfo.delegatesFee / 65535 * 100}}%</strong></label> <br/>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>

            </template>

        </template>
        <template slot="footer">

            <alert-box v-if="error" class="w-100" type="error">{{error}}</alert-box>

            <label v-if="status">{{status}}</label>

            <div class="float-end">
                <loading-button v-if="tab > 0" text="Back" @submit="handleBack" icon="fas fa-chevron-left ms-2" classCustom="btn btn-link" :iconLeft="false" />
                <loading-button :text="`${tab === maxTab ? 'Stake to Node' : 'Next'}`" @submit="handleNext" :icon="`${ tab === maxTab ? 'fa fa-laptop-code' : 'fas fa-chevron-right ms-2' }`"  />
            </div>

        </template>


    </modal>

</template>

<script>
import consts from "consts/consts"
import Modal from "src/components/utils/modal"
import PasswordInput from "src/components/utils/password-input";
import LoadingButton from "src/components/utils/loading-button.vue"
import StepsBar from "src/components/utils/steps-bar"
import HttpHelper from "src/utils/http-helper"
import AlertBox from "src/components/utils/alert-box"

export default {

    components: {Modal, PasswordInput, LoadingButton, StepsBar, AlertBox},

    data() {
        return {

            publicKeyHash: "",

            tab: 0,
            maxTab: 3,

            error: '',
            status: "",

            delegatesNodes: null,
            selectedDelegateNode: null,

            nodeInfo: null,
        }
    },

    computed:{

        version: () => version,
        address(){
            return this.$store.state.wallet.addresses[this.publicKeyHash];
        },
        account(){
            return this.$store.state.accounts.list[this.publicKeyHash]
        },
        isLoading(){
            return this.account === undefined
        },
        isFound(){
            return this.account !== null
        },

    },

    methods: {

        async setTab(resolver, value){
            try{

                value = Math.max( value, 0)
                value = Math.min( value, this.maxTab + 1)

                if (this.tab === 0 && value === 1){
                    await this.handleConnectNode()
                }
                if (this.tab === 1 && value === 2){
                    await this.handleDelegateAsk()
                }

                this.tab = value
            }catch(err) {
                console.error(err)
            }finally{
                resolver()
            }
        },

        handleBack(resolver){
            return this.setTab(resolver, this.tab - 1)
        },
        handleNext(resolver){
            return this.setTab(resolver, this.tab + 1)
        },

        showModal(publicKeyHash) {
            Object.assign(this.$data, this.$options.data());
            this.publicKeyHash = publicKeyHash
            this.delegatesNodes = JSON.parse( PandoraPay.config.helpers.getNetworkSelectedDelegatesNodes() )
            return this.$refs.modal.showModal();
        },

        closeModal() {
            return this.$refs.modal.closeModal();
        },

        delegateNodeAddress(delegateNode){
            return `${delegateNode.url.Scheme.replace("ws","http")}://${delegateNode.url.Host}`
        },

        async handleConnectNode(){

            try{

                this.error = ''
                this.nodeInfo = null;

                const json = await HttpHelper.get(this.delegateNodeAddress( this.selectedDelegateNode ) +'/delegates/info', {} );

                if (!json) throw "Node is offline";

                const out = JSON.parse(json)

                if (typeof out.delegatesCount !== "number") throw "delegatesCount is missing"
                if (typeof out.maximumAllowed !== "number") throw "maximumAllowed is missing"
                if (typeof out.challenge !== "string" || out.challenge.length !== 64) throw "challenge is missing"
                if (typeof out.delegatesFee !== "number") throw "delegatesFee is missing"
                if (out.delegatesFee > 65535) throw "delegatesFee exceeded 65535"

                if (out.maximumAllowed <= out.delegatesCount) throw "Node is Full"

                this.nodeInfo = out;

            }catch(err){
                this.error = err.toString();
                throw err
            }

        },

        async handleDelegateAsk(){

            try{
                this.error = '';

                if (!this.nodeInfo) throw Error("NodeInfo was not assigned");

                const password = await this.$store.state.page.refWalletPasswordModal.showModal()
                if (password === null ) return

                const signature = await PandoraPay.wallet.signMessageWalletAddress(this.nodeInfo.challenge, this.address.addressEncoded, password )

                const json = await HttpHelper.get(this.delegateNodeAddress( this.selectedDelegateNode ) +'/delegates/ask', {
                    qs: {
                        challengeSignature: signature,
                    }
                } );

                if (!json) throw "Node is offline";

                const out = JSON.parse(json)

                if (typeof out.exists !== "boolean") throw "exists is not a boolean"
                if (out.exists) throw "Your address already has been delegated"

                if (typeof out.delegatePublicKeyHash !== "string") throw "delegatePublicKeyHash is missing"

                const promise = new Promise((resolver, reject )=>{
                    this.$emit('onDelegateStake', {
                        delegatePublicKeyHash: out.delegatePublicKeyHash,
                        resolver,
                        reject,
                        delegatesFee: this.nodeInfo.delegatesFee,
                    } )
                })

                await promise

            }catch(err){
                this.error = err.toString();
                throw err
            }
        },

    },

}
</script>

<style scoped>
</style>
