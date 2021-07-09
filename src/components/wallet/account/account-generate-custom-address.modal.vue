<template>

    <modal ref="modal" :title="`Custom Address: ${title}`" >

        <div class="qr-code pd-top-20">

            <div>
                <input type="radio" id="" name="publicKeyHash" v-model="keyType" value="publicKeyHash">
                <label> Public Key Hash</label><br>

                <input type="radio" name="publicKey" v-model="keyType" value="publicKey">
                <label> Public Key</label> <i class="fa fa-question" v-tooltip.bottom="'It will allow users to send you encrypt messages'" ></i> <br>
            </div>

            <div>
                <input type="checkbox"  name="checkbox" v-model="hasAmount"  >
                <label> Amount </label> <i class="fa fa-question" v-tooltip.bottom="'Specify a default amount to be sent to you'" ></i>  <br>
                <input v-if="hasAmount" type="number" v-model="amount" min="0">

                <input type="checkbox"  name="checkbox" v-model="hasPaymentId"  >
                <label> PaymentId</label> <i class="fa fa-question" v-tooltip.bottom="'Specify a default message(paymentId)'" ></i>  <br>
                <input v-if="hasPaymentId" type="text" v-model="paymentId" min="0"  >
            </div>

            <button type="button" @click="handleClick">
                <i class="fa fa-cog"></i>
                Generate Address
            </button>

            <div v-if="error" class="alert alert-danger border-2 d-flex align-items-center">
                <div class="bg-white me-3 icon-item"><i class="fa fa-times"></i> </div>
                <p class="mb-0 flex-1">{{error}}</p>
            </div>

            <div v-if="this.addressGenerated">
                <span class="wordwrap">
                    {{this.addressGenerated}}
                </span>
            </div>

            <qr-code v-if="this.addressGenerated" :data="this.addressGenerated" />
        </div>

    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import QRCode from "src/components/utils/qr-code"

export default {

    components: { Modal, 'qrCode': QRCode, },

    data(){
        return {
            error: '',
            account: null,
            title: "",
            keyType: "publicKeyHash",
            hasAmount: false,
            hasPaymentId: false,

            amount: 0,
            paymentId: "",

            addressGenerated: ""
        }
    },

    computed:{

    },

    methods: {

        showModal(account) {

            Object.assign(this.$data, this.$options.data());

            this.account = account;
            this.title = account.name;

            this.$refs.modal.showModal();

        },

        closeModal() {
            this.$refs.modal.closeModal();
        },

        async handleClick(){

            this.error = ""
            this.addressGenerated = ""

            try{

                let args = []

                if (this.keyType === "publicKeyHash")
                    args.push( this.account.publicKeyHash )
                else
                if (this.keyType === "publicKey")
                    args.push( this.account.publicKey )

                if (this.hasAmount )
                    args.push( Number.parseInt(this.amount) )

                if (this.hasPaymentId){
                    if (!this.hasAmount)
                        args.push( Number.parseInt(0) )
                    args.push(this.paymentId)
                }


                const out = await PandoraPay.addresses.generateAddress( ...args )
                this.addressGenerated = out[1]

            }catch(err){
                this.error = err.toString()
            }


        }

    }

}
</script>

<style scoped>

</style>
