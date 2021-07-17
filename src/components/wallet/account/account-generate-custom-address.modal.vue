<template>

    <modal ref="modal" :title="`Custom Address ${title ? ': ' + title : ''}`" content-class="">

        <template slot="body">

            <div class="theme-wizard" v-if="account">
                <div class="card-header bg-light pt-0 pb-2">
                    <ul class="nav justify-content-between nav-wizard">
                        <li class="nav-item">
                            <a :class="`nav-link ${tab===0?'active':''} fw-semi-bold`" href="#" @click="()=>setTab(0)">
                                <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-key"></i></span></span>
                                <span class="d-none d-md-block mt-1 fs--1">Public Key</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a :class="`nav-link ${tab===1?'active':''} fw-semi-bold`" href="#" @click="()=>setTab(1)">
                                <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-dollar-sign"></i></span></span>
                                <span class="d-none d-md-block mt-1 fs--1">Amount</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a :class="`nav-link ${tab===2?'active':''} fw-semi-bold`" href="#" @click="()=>setTab(2)">
                                <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-hand-holding-usd"></i></span></span>
                                <span class="d-none d-md-block mt-1 fs--1">Payment ID</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a :class="`nav-link ${tab===3?'active':''} fw-semi-bold`" href="#" @click="()=>setTab(3)">
                                <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-check"></i></span></span>
                                <span class="d-none d-md-block mt-1 fs--1">Done</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="card-body py-3">
                    <div class="tab-content">
                        <div :class="`tab-pane ${tab===0?'active':''} `">
                            <div class="form-check">
                                <input class="form-check-input" id="publicKeyHash" type="radio" value="publicKeyHash" v-model="keyType" />
                                <label class="form-check-label" for="publicKeyHash">Public Key Hash</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" id="publicKey" type="radio" value="publicKey" v-model="keyType" :disabled="!this.account.publicKey" />
                                <label class="form-check-label" for="publicKey">Public Key</label>
                                <i class="fa fa-question" v-tooltip.bottom="'It will allow users to send you encrypt messages'" ></i> <br>
                            </div>
                        </div>
                        <div :class="`tab-pane ${tab===1?'active':''}`">
                            <div class="form-check">
                                <input class="form-check-input" id="amount" type="checkbox"  name="checkbox" v-model="hasAmount"  >
                                <label class="form-check-label" for="amount"> Amount </label>
                                <i class="fa fa-question" v-tooltip.bottom="'Specify a default amount to be sent to you'" ></i>  <br>
                                <input class="form-control" v-if="hasAmount" type="number" v-model="amount" min="0" style="width: 14rem;">
                            </div>
                        </div>
                        <div :class="`tab-pane ${tab===2?'active':''} `">
                            <div class="form-check">
                                <input class="form-check-input" id="paymentId" type="checkbox"  name="checkbox" v-model="hasPaymentId"  >
                                <label class="form-check-label" for="paymentId"> PaymentId</label>
                                <i class="fa fa-question" v-tooltip.bottom="'Specify a default message(paymentId)'" ></i>  <br>
                                <input class="form-control" v-if="hasPaymentId" type="text" v-model="paymentId" >
                            </div>
                        </div>
                        <div :class="`tab-pane ${tab===3?'active':''} `">

                            <alert-box v-if="error" type="error">{{error}}</alert-box>

                            <template v-if="this.addressGenerated">

                                <div class="form-outline">
                                    <label class="form-label" for="address">Generated Address</label>
                                    <div id="address" class="address align-items-center">
                                        <account-identicon :address="this.addressGenerated" size="30" outer-size="10" />
                                        <span class="text-break">
                                            {{this.addressGenerated}}
                                        </span>
                                    </div>
                                </div>

                                <hr/>

                                <div class="g-0 d-block-inline ">
                                    <button class="btn btn-falcon-default rounded-pill me-1 mb-1" type="button" @click="copyAddress" v-tooltip.bottom="'Copy Address'" >
                                        <i class="fa fa-copy pointer" />
                                    </button>

                                    <button class="btn btn-falcon-default rounded-pill me-1 mb-1" type="button" @click="showAccountQRCode" v-tooltip.bottom="'Show Address QR Code'">
                                        <i class="fa fa-qrcode pointer" />
                                    </button>
                                </div>
                            </template>

                        </div>
                    </div>
                </div>
            </div>

        </template>

        <template slot="footer">
            <button class="btn btn-link" type="button" v-if="tab > 0" @click="()=>increaseTab(-1)">
                Back <i class="fas fa-chevron-left me-2" data-fa-transform="shrink-3"></i>
            </button>
            <button class="btn btn-falcon-primary" type="button" v-if="tab < 3" @click="()=>increaseTab(1)">
                <i class="fas fa-chevron-right ms-2" data-fa-transform="shrink-3"> </i> Next
            </button>
        </template>


    </modal>

</template>

<script>

import Modal from "src/components/utils/modal"
import AlertBox from "src/components/utils/alert-box"
import AccountIdenticon from "./account-identicon";

export default {

    components: {AccountIdenticon, Modal, AlertBox},

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

            addressGenerated: "",

            tab: 0,
        }
    },

    computed:{

    },

    methods: {

        showModal(account) {

            Object.assign(this.$data, this.$options.data());

            this.account = account;
            this.title = account.name;

            return this.$refs.modal.showModal();

        },

        closeModal() {
            return this.$refs.modal.closeModal();
        },

        copyAddress(){
            this.$copyText(this.addressGenerated).then( e =>
                    this.$notify({
                        type: 'success',
                        title: `Copied to clipboard successfully`,
                        text: `Address ${this.addressGenerated} copied to clipboard`,
                    }),
                e =>
                    this.$notify({
                        type: 'error',
                        title: `Clipboard failed`,
                        text: `Failed to copy to clipboard`,
                    })
            )
        },
        showAccountQRCode(){
            return this.$store.state.page.refQRCodeModal.showModal( this.addressGenerated, this.account.name || '');
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

                console.log(args)

                const out = await PandoraPay.addresses.generateAddress( ...args )
                this.addressGenerated = out[1]

            }catch(err){
                this.error = err.toString()
            }

        },

        increaseTab(value){
            this.tab = this.tab + value
            if (this.tab === 3) this.handleClick()
        },
        setTab(value){
            this.tab = value
            if (this.tab === 3) this.handleClick()
        }

    }

}
</script>

<style scoped>
    .address{
        display: grid;
        grid-template-columns: 50px 1fr;
        grid-column-gap: 10px;
    }
</style>
