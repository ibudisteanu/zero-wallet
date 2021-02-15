<template>

    <modal ref="modal" title="Delegate Stake">

        <span class="disabled">Node address</span>
        <select v-model="nodeAddress">
            <option v-for="(node, key) in delegateStakesNodes"
                    :key="`node-${key}`"
                    :value="node.address">
                {{node.address}} Fee: {{node.fee}} %
            </option>
        </select>

        <div v-if="isWalletEncrypted" class="pd-top-40">
            <span class="disabled">Wallet password</span>
            <password-input v-model="walletPassword"></password-input>
        </div>

        <span v-if="error" class="danger">
            {{error}}
        </span>

        <loading-button text="Delegate your stake to node" @submit="handleDelegateStake" icon="fa fa-laptop-code"  />

    </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import PasswordInput from "src/components/utils/password-input";
import LoadingButton from "src/components/utils/loading-button.vue"
import consts from "consts/consts"
import HttpHelper from "src/utils/http-helper"

export default {

    components: {Modal, PasswordInput, LoadingButton},


    data() {
        return {
            delegate: null,
            delegateNonce: 0,
            error: '',

            nodeAddress:'',
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
            this.delegateNonce = delegate ? delegate.delegateNonce : 0;

            this.$refs.modal.showModal();
        },


        closeModal() {
            this.$refs.modal.closeModal();
        },

        async handleDelegateStake(resolve){

            this.error = '';

            try{

                const checkPassword = await PandoraPay.wallet.encryption.checkPassword(this.walletPassword);
                if (!checkPassword)
                    throw {message: "Your wallet password is invalid"};

                if (!this.nodeAddress) throw "Node Address is not selected";

                let challenge = await HttpHelper.post(this.nodeAddress+'/wallet-stakes/challenge', );
                if (!challenge ) throw "Challenge couldn't be get. Maybe node is offline";

                if (typeof challenge === "string") challenge = Buffer.from(challenge, "hex");

                console.log("this.delegate", this.delegate);

                const publicKey = Buffer.from( this.address.publicKey, "hex");
                let delegatePublicKeyHash = Buffer.from( this.delegate.delegatePublicKeyHash, "hex");

                //getting private key
                const addressWallet = PandoraPay.wallet.manager.getWalletAddressByAddress( this.address.address, false, this.walletPassword );
                const delegatePrivateAddress = addressWallet.decryptDelegateStakePrivateAddress( this.delegate.delegateNonce, this.walletPassword );

                let delegatePrivateKey;
                if (delegatePrivateAddress.publicKey.toString("hex") === this.delegate.delegatePublicKeyHash)
                    delegatePrivateKey = delegatePrivateAddress.privateKey;

                const concat = Buffer.concat([
                    challenge,
                    publicKey,
                    delegatePublicKeyHash,
                    delegatePrivateKey ? delegatePrivateKey : Buffer.alloc(0),
                ]);

                const signature = addressWallet.sign( concat, this.walletPassword );
                if (!signature) throw "message couldn't be signed";

                console.log( {publicKey, signature, delegatePublicKeyHash, delegatePrivateKey} );

                const out = await HttpHelper.post(this.nodeAddress+'/wallet-stakes/import-wallet-stake', {
                    publicKey: publicKey.toString("hex"),
                    signature: signature.toString("hex"),
                    delegatePublicKeyHash: delegatePublicKeyHash.toString('hex'),
                    delegatePrivateKey: delegatePrivateKey ? delegatePrivateKey.toString('hex') : undefined
                });

                if (!out) throw "An error has occurred";

                if ( !out.result && out.error ){

                    if (out.error === "Your stake delegate's public key is not matching with the private key" && kernel.helpers.StringHelper.isHex(out.errorData) )
                        throw out.error + " " + out.errorData;

                    if (out.error === "You need to delegate your stake to the following public key" && kernel.helpers.StringHelper.isHex(out.errorData) )
                        throw out.error + " " + out.errorData;

                    throw out.error;

                }

                if (out)
                    this.$notify({
                        type: 'success',
                        title: `Your stake was delegated successfully to Node `,
                        text: `Your stake was delegated successfully to node. \n node ${this.nodeAddress}`,
                    });

                console.log("out", out);

            }catch(err){
                console.error(err);
                this.error = err;
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