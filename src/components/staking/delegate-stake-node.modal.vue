<template>

    <modal ref="modal" title="Delegate Stake to Node" content-class="">

        <template slot="body">

            <alert-box v-if="!isLoading && !isFound" type="warning" >
                Address doesn't exist!
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
                                            {{node.name}} || {{node.url.Scheme}}://{{node.url.Host}}
                                        </option>
                                    </select>
                                </div>

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

        setTab(resolver, value){
            try{

                value = Math.max( value, 0)
                value = Math.min( value, this.maxTab + 1)

                if (this.tab === 1 && value === 2){
                }
                if (this.tab === 2 && value === 3){
                }

                this.tab = value
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

        async handleConnectNode(resolve){

            this.error = ''
            this.nodeInfo = null;

            try{

                const out = await HttpHelper.post(this.nodeAddress+'/wallet-stakes/is-delegating-open', {
                    address: this.address.addressEncoded,
                } );
                if (!out ) throw Error("Node is offline");

                if (typeof out.allowDelegating !== "boolean") throw Error("allowDelegating is not Bool");
                if (typeof out.alreadyIncluded !== "boolean") throw Error("alreadyIncluded is not Bool");
                if (typeof out.availableSlots !== "number") throw Error("availableSlots is not Number");
                if (typeof out.maximumDelegates !== "number") throw Error("maximumDelegates is not Number");
                if (typeof out.minimumFeePercentage !== "number") throw Error("minimumFeePercentage is not Number");

                if (!out.allowDelegating) this.error = "Your selected node doesn't accept delegations";
                if (out.alreadyIncluded) this.error = "You already delegated to this node";
                if (!out.availableSlots) this.error = "The node is completely full";

                this.nodeInfo = out;
                this.step = 2;

            }catch(err){
                this.error = err.message;
            }finally{
                resolve(true);
            }

        },

        async handleDelegateStake(resolve){

            this.error = '';

            try{

                if (!this.nodeAddress) throw Error("Node Address is not selected");

                let challenge = await HttpHelper.post(this.nodeAddress+'/wallet-stakes/challenge', );
                if (!challenge ) throw Error("Challenge couldn't be get. Maybe node is offline");

                if (typeof challenge === "string") challenge = Buffer.from(challenge, "hex");

                const publicKey = Buffer.from( this.address.publicKey, "hex");

                //getting private key
                const addressWallet = PandoraPay.wallet.manager.getWalletAddressByAddress( this.address.addressEncoded, false);
                const delegateStakePrivateKeyModel = addressWallet.decryptGetDelegateStakePrivateKeyModel(this.delegate.delegateStakeNonce );
                const delegateStakeAddressModel = delegateStakePrivateKeyModel.getAddressPublicKey();

                const delegateStakePublicKey = delegateStakeAddressModel.publicKey;
                if (!delegateStakePublicKey.equals( Buffer.from(this.delegate.delegateStakePublicKey, 'hex') ))
                    throw Error("Delegated Private Key is different")

                const concat = Buffer.concat([
                    challenge,
                    publicKey,
                    delegateStakePublicKey,
                    delegateStakePrivateKeyModel ? delegateStakePrivateKeyModel.privateKey : Buffer.alloc(0),
                ]);

                const signature = addressWallet.keys.sign( PandoraLibrary.helpers.crypto.CryptoHelper.dkeccak256(concat) );
                if (!signature) throw Error("Message couldn't be signed");

                const out = await HttpHelper.post(this.nodeAddress+'/wallet-stakes/import-wallet-stake', {
                    publicKey: publicKey.toString("hex"),
                    signature: signature.toString("hex"),
                    delegateStakePrivateKey: delegateStakePrivateKeyModel.privateKey.toString('hex'),
                });

                if (!out) throw Error("An error has occurred");

                if ( !out.result && out.error ){

                    if (out.error === "Your stake delegate's public key is not matching with the private key" && PandoraLibrary.helpers.StringHelper.isHex(out.errorData) )
                        throw out.error + " " + out.errorData;

                    if (out.error === "You need to delegate your stake to the following public key" && PandoraLibrary.helpers.StringHelper.isHex(out.errorData) )
                        throw out.error + " " + out.errorData;

                    throw out.error;

                }

                if (out) {
                    await this.$store.dispatch('addToast', {
                        type: 'success',
                        title: `Your stake was delegated successfully to Node `,
                        text: `Your stake was delegated successfully to node. \n node ${this.nodeAddress}`,
                    });
                    this.step = 3;
                }

                console.log("out", out);

            }catch(err){
                console.error(err);
                this.error = err.message;
            }finally{
                resolve(true);
            }
        }

    },

}
</script>

<style scoped>
</style>
