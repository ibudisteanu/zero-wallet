<template>

    <modal ref="modal" title="Delegate Stake">

        <steps-bar :length="3" :active="step" />

        <template v-if="step === 1">
            <span class="disabled">Node address</span>
            <select v-model="nodeAddress">
                <option v-for="(node, key) in delegateStakesNodes"
                        :key="`node-${key}`"
                        :value="node.address">
                    {{node.address}} Fee: {{node.fee}} %
                </option>
            </select>
            <loading-button text="Connect to delegated node" @submit="handleConnectNode" icon="fa fa-laptop-code"  />
        </template>
        <template v-if="step === 2">
            <div v-if="nodeInfo">
                <span>Allow Delegating: <strong>{{nodeInfo.allowDelegating}}</strong></span>
                <span>Already included: <strong>{{nodeInfo.alreadyIncluded}}</strong></span>
                <span>Available slots: <strong>{{nodeInfo.maximumDelegates - nodeInfo.availableSlots}}</strong>  / {{nodeInfo.maximumDelegates}} </span>
                <span>Minimum Fee: <strong>{{nodeInfo.minimumFeePercentage}}</strong></span>
            </div>

            <loading-button text="Delegate your stake to node" @submit="handleDelegateStake" icon="fa fa-laptop-code"  />
        </template>
        <template v-if="step === 3">
            <span>Your stake has been delegated!</span>
        </template>

        <span v-if="error" class="danger">
            {{error}}
        </span>


    </modal>

</template>

<script>
import consts from "consts/consts"
import Modal from "src/components/utils/modal"
import PasswordInput from "src/components/utils/password-input";
import LoadingButton from "src/components/utils/loading-button.vue"
import StepsBar from "src/components/utils/steps-bar"
import HttpHelper from "src/utils/http-helper"

export default {

    components: {Modal, PasswordInput, LoadingButton, StepsBar},


    data() {
        return {

            step: 1,

            delegate: null,
            delegateStakeNonce: 0,
            error: '',

            nodeAddress:'',
            nodeInfo: null,
        }
    },

    props:{
        address: {default: null},
    },

    computed:{

        isWalletEncrypted() {
            return this.$store.state.wallet.encrypted;
        },

        delegateStakesNodes(){
            return consts.delegateStakesNodes;
        },

    },

    methods: {

        showModal(delegate) {
            Object.assign(this.$data, this.$options.data());

            this.delegate = delegate;
            this.delegateStakeNonce = delegate ? delegate.delegateStakeNonce : 0;

            this.$refs.modal.showModal();
        },


        closeModal() {
            this.$refs.modal.closeModal();
        },

        async handleConnectNode(resolve){

            this.error = ''
            this.nodeInfo = null;

            try{

                const out = await HttpHelper.post(this.nodeAddress+'/wallet-stakes/is-delegating-open', {
                    address: this.address.address,
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
                const addressWallet = PandoraPay.wallet.manager.getWalletAddressByAddress( this.address.address, false);
                const delegateStakePrivateKeyModel = addressWallet.decryptGetDelegateStakePrivateKeyModel(this.delegate.delegateStakeNonce );
                const delegateStakeAddressModel = delegateStakePrivateKeyModel.getAddressPublicKey();

                const delegateStakePublicKeyHash = delegateStakeAddressModel.publicKeyHash;
                if (!delegateStakePublicKeyHash.equals( Buffer.from(this.delegate.delegateStakePublicKeyHash, 'hex') ))
                    throw Error("Delegated Private Key is different")

                const concat = Buffer.concat([
                    challenge,
                    publicKey,
                    delegateStakePublicKeyHash,
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

                    this.$notify({
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

    mounted(){
        this.nodeAddress = this.delegateStakesNodes[0];
    }

}
</script>

<style scoped>
</style>