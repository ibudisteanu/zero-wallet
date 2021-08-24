<template>

    <modal ref="modal" :title="`Custom Address ${title ? ': ' + title : ''}`" content-class="">

        <template slot="body" v-if="account">

            <div class="theme-wizard">
                <div class="card-header bg-light pt-0 pb-2">
                    <ul class="nav justify-content-between nav-wizard">
                        <li class="nav-item">
                            <router-link :class="`nav-link ${tab===0?'active':''} fw-semi-bold`" to="#" @click.native="()=>setTab(1)">
                                <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-dollar-sign"></i></span></span>
                                <span class="d-none d-md-block mt-1 fs--1">Amount</span>
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link :class="`nav-link ${tab===1?'active':''} fw-semi-bold`" to="#" @click.native="()=>setTab(2)">
                                <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-hand-holding-usd"></i></span></span>
                                <span class="d-none d-md-block mt-1 fs--1">Payment ID</span>
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link :class="`nav-link ${tab===2?'active':''} fw-semi-bold`" to="#" @click.native="()=>setTab(3)">
                                <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-check"></i></span></span>
                                <span class="d-none d-md-block mt-1 fs--1">Done</span>
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div class="card-body py-3">
                    <div class="tab-content">
                        <div :class="`tab-pane ${tab===0?'active':''}`">
                            <div class="form-check">
                                <input class="form-check-input" id="amount" type="checkbox"  name="checkbox" v-model="hasAmount"  >
                                <label class="form-check-label" for="amount"> Amount </label>
                                <i class="fa fa-question" v-tooltip.bottom="'Specify a default amount to be sent to you'" ></i>  <br>
                                <input :class="`form-control ${validateAmount ? 'is-invalid' : ''}`" v-if="hasAmount" type="number" v-model="amount" min="0" style="width: 14rem;">
                                <div v-if="validateAmount" class="invalid-feedback d-block">{{validateAmount}}</div>
                            </div>
                        </div>
                        <div :class="`tab-pane ${tab===1?'active':''} `">
                            <div class="form-check">
                                <input class="form-check-input" id="paymentId" type="checkbox"  name="checkbox" v-model="hasPaymentId"  >
                                <label class="form-check-label" for="paymentId"> PaymentId</label>
                                <i class="fa fa-question" v-tooltip.bottom="'Specify a default message(paymentId)'" ></i>  <br>
                                <input :class="`form-control ${validationPaymentId ? 'is-invalid' : ''}`" v-if="hasPaymentId" type="text" v-model="paymentId" >
                                <div v-if="validationPaymentId" class="invalid-feedback d-block">{{validationPaymentId}}</div>
                            </div>
                        </div>
                        <div :class="`tab-pane ${tab===2?'active':''} `">

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
                                    <button class="btn btn-falcon-default rounded-pill me-1 mb-1 pointer" type="button" @click="copyAddress" v-tooltip.bottom="'Copy Address'" >
                                        <i class="fa fa-copy" />
                                    </button>

                                    <button class="btn btn-falcon-default rounded-pill me-1 mb-1 pointer" type="button" @click="showAccountQRCode" v-tooltip.bottom="'Show Address QR Code'">
                                        <i class="fa fa-qrcode" />
                                    </button>
                                </div>
                            </template>

                        </div>
                    </div>
                </div>
            </div>

        </template>

        <template slot="footer">
            <alert-box v-if="error" class="w-100" type="error">{{error}}</alert-box>

            <button class="btn btn-link" type="button" v-if="tab > 0" @click="()=>increaseTab(-1)">
                Back <i class="fas fa-chevron-left me-2" ></i>
            </button>
            <button class="btn btn-falcon-primary" type="button" v-if="tab < 3" @click="()=>increaseTab(1)">
                <i class="fas fa-chevron-right ms-2"> </i> Next
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
            hasAmount: false,
            hasPaymentId: false,

            amount: 0,
            paymentId: "",

            addressGenerated: "",

            tab: 0,
        }
    },

    computed:{

        validateAmount(){
            try{
                if (!this.hasAmount) return ""

                try{
                    const x = Number.parseFloat(this.amount)
                    if (x === Number.NaN) throw "NaN"
                    if (x < 0) throw "Number can't be negative"
                }catch(err){
                    throw "Invalid Number"
                }
            }catch(err){
                return err.toString()
            }
        },

        validationPaymentId(){
            try{
                if (!this.hasPaymentId) return ""
                if (this.paymentId.length !== 16) throw "PaymentId should be an 8 byte hexadecimal number"
                let buf
                try{
                    buf = Buffer.from(this.paymentId, "hex")
                }catch(err){
                    throw "PaymentId must be a hexadeciaml number"
                }
                if (buf.length !== 8) throw "PaymentId should be an 8 byte hexadecimal number"

            }catch(err){
                return err.toString()
            }
        }

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
            this.$copyText(this.addressGenerated).then(
                e => this.$store.dispatch('addToast', {
                        type: 'success',
                        title: `Copied to clipboard successfully`,
                        text: `Address ${this.addressGenerated} copied to clipboard`,
                    }),
                e => this.$store.dispatch('addToast', {
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
            if (this.tab === 2) this.handleClick()
        },
        setTab(value){
            this.tab = value
            if (this.tab === 2) this.handleClick()
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
