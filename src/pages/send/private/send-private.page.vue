<template>

    <layout>

        <layout-title icon="fa-money-check-alt" title="Send Privately Funds">Transfer privately funds from your account.</layout-title>

        <template v-if="address">

            <alert-box v-if="!isLoading && !isFound" type="warning" >
                Address doesn't exist (is empty)!
            </alert-box>
            <template v-else>
                <div class="card theme-wizard my-5">
                    <div class="card-header bg-light py-3">
                        <ul class="nav justify-content-between nav-wizard">
                            <li class="nav-item">
                                <span :class="`nav-link ${tab===0?'active':''} fw-semi-bold`" >
                                    <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-users"></i></span></span>
                                    <span class="d-none d-md-block mt-1 fs--1">Receiver</span>
                                </span>
                            </li>
                            <li class="nav-item">
                                <span :class="`nav-link ${tab===1?'active':''} fw-semi-bold`">
                                    <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-eye-slash"></i></span></span>
                                    <span class="d-none d-md-block mt-1 fs--1">Privacy</span>
                                </span>
                            </li>
                            <li class="nav-item">
                                <span :class="`nav-link ${tab===2?'active':''}  fw-semi-bold`" >
                                    <span class="nav-item-circle-parent"><span class="nav-item-circle"><i class="fas fa-dollar-sign"></i></span></span>
                                    <span class="d-none d-md-block mt-1 fs--1">Fee</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body py-3">
                        <div class="tab-content">
                            <div :class="`tab-pane ${tab===0?'active':''} `">

                                <tx-token :tokens="availableTokens" @changed="changedToken" class="pb-4" />

                                <destination-address :accounts="availableAccounts"
                                                     :token="token.token"
                                                     @changed="changedDestination">
                                </destination-address>

                                <alert-box v-if="checkDestinationError" class="w-100" type="error">{{checkDestinationError}}</alert-box>

                                <extra-data :destinations="[destination]" class="pt-4"
                                            :paymentId="identifiedPaymentID"
                                            @changed="changedExtraData" />

                            </div>
                            <div :class="`tab-pane ${tab===1?'active':''} `">

                                <div class="row">

                                    <div class="col-12 col-md-6">
                                        <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Ring Size</label>
                                        <i class="fa fa-question " v-tooltip.bottom="`Bigger the ring, more private is your transaction.`" />
                                        <select class="form-select" v-model="ringSize">
                                            <option :value="2">2</option>
                                            <option :value="4">4</option>
                                            <option :value="8">8</option>
                                            <option :value="16">16</option>
                                            <option :value="32">32</option>
                                            <option :value="64">64</option>
                                            <option :value="128">128</option>
                                            <option :value="256">256</option>
                                        </select>
                                    </div>

                                    <div class="col-12 col-md-6">
                                        <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Ring New Addresses</label>
                                        <i class="fa fa-question " v-tooltip.bottom="`Number of new addresses in the ring. Makes new destinations more private.`" />
                                        <input class="form-control"  type="number" v-model="ringNewAddresses" />
                                    </div>

                                    <div class="col-12 pt-4">
                                        <loading-button text="Generate Ring" @submit="handleGenerateRing" icon="fa fa-cogs" />
                                    </div>

                                    <div class="col-12 pt-4">
                                        <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Ring Members</label>
                                        <i class="fa fa-question " v-tooltip.bottom="`Preview of the Ring Members used for your private transaction.`" />
                                        <div class="pt-2">
                                            <div v-for="(ringMember, index) in ringMembers" class="d-inline-block"
                                                 :key="`ring_member_${index}`">
                                                <account-identicon :address="ringMember" size="21" outer-size="7" :disable-route="true" />
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            <div :class="`tab-pane ${tab===2?'active':''} `">
                                <tx-fee :accounts="availableAccounts" :token="token" :allow-zero="true" @changed="changedFee" />
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-light">

                        <alert-box v-if="error" class="w-100" type="error">{{error}}</alert-box>

                        <label v-if="status">{{status}}</label>

                        <div class="float-end">
                            <loading-button v-if="tab > 0" text="Back" @submit="handleBack" icon="fas fa-chevron-left ms-2" classCustom="btn btn-link" :iconLeft="false" />
                            <loading-button :text="`${tab === maxTab ? 'Delegate' : 'Next'}`" @submit="handleNext" :icon="`${ tab === maxTab ? 'fa fa-credit-card' : 'fas fa-chevron-right ms-2' }`"  />
                        </div>
                    </div>
                </div>

            </template>

        </template>
        <div class="py-3 text-center" v-else>
            <loading-spinner class="fs-3" />
        </div>


    </layout>
</template>

<script>

const {version} = PandoraPay.enums.wallet.address;

import Layout from "src/components/layout/layout"
import Account from "src/components/wallet/account/account"
import LoadingSpinner from "src/components/utils/loading-spinner";
import LoadingButton from "src/components/utils/loading-button"
import DestinationAddress from "src/components/send/destination-address"
import TxAmount from "src/components/send/tx-amount"
import TxToken from "src/components/send/tx-token"
import TxFee from "src/components/send/tx-fee"
import ExtraData from "src/components/send/extra-data"
import Vue from 'vue'
import AlertBox from "src/components/utils/alert-box"
import LayoutTitle from "src/components/layout/layout-title";
import AccountIdenticon from "src/components/wallet/account/account-identicon";

export default {

    components: { LayoutTitle, Layout, Account, LoadingSpinner, LoadingButton, DestinationAddress, TxAmount,
        ExtraData, AlertBox, TxFee, TxToken, AccountIdenticon,
    },

    data(){
        return {
            tab: 0,
            maxTab: 3,

            token: { }, //contains token.token and token.validation
            destination: {},
            fee: {  },

            extraData: {
                data: "",
                type: "public",
                publicKeyToEncrypt: "",
                validationError: null,
            },

            ringSize: 32,
            ringNewAddresses: 2,
            ringMembers: [],

            error: '',
            status: '',
        }
    },

    computed:{

        version: () => version,
        address(){
            return this.$store.state.wallet.addresses[this.$store.state.wallet.mainPublicKey] ;
        },
        account(){
            return this.$store.state.accounts.list[this.$store.state.wallet.mainPublicKey]
        },
        availableTokens(){
            if (this.account && this.account.tokens ) return this.account.tokens;
            return null
        },
        availableAccounts(){
            if (this.account && this.account.accounts ) return this.account.accounts;
            return null
        },
        isLoading(){
            return this.account === undefined
        },
        isFound(){
            return this.account !== null
        },

        checkDestinationError(){

            try{

                if (this.destination.address)
                    if (this.destination.publicKey === this.address.publicKey) throw "Destination can not be the same with from";

            }catch (err){
                return err.toString()
            }

        },

        identifiedPaymentID(){
            if (this.destination.address) {
                if (this.destination.address.paymentId)
                    return this.destination.address.paymentId
            }
        },

    },

    watch: {
        async destination (to, from){
            if (to === from) return

            await this.$store.state.blockchain.syncPromise;

            if (to && to.address )
                await this.$store.dispatch('subscribeAccount', to.address.publicKey )

            if (from && from.address && from.address.publicKey && !this.$store.getters.walletContains(from) )
                await this.$store.dispatch('unsubscribeAccount', from.address.publicKey )
        }
    },

    methods:{

        async setTab(resolver, value){
            try{

                this.error = ""

                value = Math.max( value, 0)
                value = Math.min( value, this.maxTab + 1)

                if (this.tab === 0 && value === 1){
                    if (this.token.validationError) throw this.token.validationError
                    if (this.checkDestinationError) throw this.checkDestinationError
                    if (this.destination.validationError) throw this.destination.validationError;

                    await this.$store.state.blockchain.syncPromise;
                    await this.$store.dispatch('subscribeAccount', this.destination.address.publicKey )

                    if (!this.$store.state.accounts.list[this.destination.address.publicKey] && !this.destination.address.registration )
                        throw "Destination Address doesn't have the registration. \n You have the shorter version of the address. First time when an address is used it requires the longer version."

                }
                if (this.tab === 1 && value === 2){
                    if (this.extraData.validationError) throw this.extraData.validationError
                    if (this.ringSize !== this.ringMembers.length) throw `Ring members are not generated well ${this.ringSize} vs ${this.ringMembers.length} `
                }
                if (this.tab === 2 && value === 3){
                    if (this.fee.feeAuto.validationError) throw this.fee.feeAuto.validationError
                    if (this.fee.feeManual.validationError) throw this.fee.feeManual.validationError

                    await this.handleSendFunds()
                }

                this.tab = value

            }catch(err) {
                this.error = err
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

        changedDestination(data){
            this.destination = {
                ...this.destination,
                ...data,
            }
        },

        changedToken(data){
            this.token = { ...this.token,  ...data, }
        },
        changedFee(data){
            this.fee = { ...this.fee,  ...data, }
        },
        changedExtraData(data){
            this.extraData = { ...this.extraData,  ...data, }
        },

        async handleGenerateRing(resolver){

            try{

                this.error = ""
                const holders = await PandoraPay.network.getNetworkAccountsHolders(this.token.token)

                const ringSize = this.ringSize
                let newAccounts = this.ringNewAddresses

                if (ringSize < 0 ) throw "RingSize can not be negative"
                if ( (Math.log(ringSize)/Math.log(2)) % 1 !== 0 ) throw "RingSize needs to be power of 2"
                if ( ringSize > 256 ) throw "RingSize max supported is 256"

                if ( newAccounts < 0 || newAccounts > ringSize-2) throw "New accounts needs to be in the interval [0, ringSize-2]"

                const alreadyUsedIndexes = {}

                let foundSender = false
                for (let i=0; i < this.availableAccounts.length; i++)
                    if (this.availableAccounts[i].token === this.token.token){
                        alreadyUsedIndexes[this.availableAccounts[i].index] = true
                        foundSender = true
                        break
                    }

                if (!foundSender) throw "Account not found for sender"

                if (this.$store.state.accounts.list[ this.destination.address.publicKey]){
                    let availableAccounts = this.$store.state.accounts.list[ this.destination.address.publicKey]
                    for (let i=0; i < availableAccounts.length; i++)
                        if (availableAccounts.token === this.token.token)
                            alreadyUsedIndexes[availableAccounts.index] = true
                }

                const count = Math.min( holders, ringSize - 2 )
                for (let i=0; i < count; i++){

                    let index = await PandoraPay.helpers.randomUint64N( holders.toString() )
                    while (alreadyUsedIndexes[index])
                        index = await PandoraPay.helpers.randomUint64N( holders.toString() )

                    alreadyUsedIndexes[index] = true
                }

                let str = Object.keys(alreadyUsedIndexes).join(',')
                if (str.length && str[str.length-1] === ',') str = str.splice(0, str.length-1 )

                const out = await PandoraPay.network.getNetworkAccountsByIndex( str, this.token.token, false )
                let publicKeys = JSON.parse( MyTextDecode(out) ).publicKeys

                const publicKeysMap = {}
                for (let i=0; i < publicKeys.length; i++)
                    publicKeysMap[ publicKeys[i] ] = true

                const alreadyUsedPublicKeys = {}
                let ringMembers = []

                alreadyUsedPublicKeys[this.address.publicKey] = true
                ringMembers.push(this.address.addressEncoded)

                alreadyUsedPublicKeys[this.destination.address.publicKey] = true
                ringMembers.push(this.destination.addressEncoded)

                delete publicKeysMap[this.$store.state.wallet.mainPublicKey]
                delete publicKeysMap[this.destination.address.publicKey]
                publicKeys = Object.keys(publicKeysMap)

                let c = 0
                for ( let i =0; i < ringSize-2; i++){

                    if (i < newAccounts || holders - 2 + newAccounts <= i ){
                        let out = await PandoraPay.addresses.generateNewAddress()
                        const data = JSON.parse( MyTextDecode(out) )
                        alreadyUsedPublicKeys[ data[2] ] = true
                        ringMembers[i] = data[1]
                    }else {
                        alreadyUsedPublicKeys[ publicKeys[c] ] = true
                        const out = await PandoraPay.addresses.generateAddress(publicKeys[c], "", 0, "")
                        const json = JSON.parse( MyTextDecode(out) )
                        ringMembers[i] = json[1]
                        c += 1
                    }

                }

                this.ringMembers = ringMembers

            }catch(err){
                this.error = err.toString()
            }finally{
                resolver()
            }
        },

        async handleSendFunds(){

            try{

                this.error = '';
                this.status = '';

                const amounts = { }

                for (const destination of this.destinations)
                    amounts.push = destination.amount

                const password = await this.$store.state.page.refWalletPasswordModal.showModal()
                if (password === null ) return

                //compute extra
                const out = await PandoraPay.transactions.builder.createSimpleTx_Float( JSON.stringify({
                    from: [this.address.addressEncoded],
                    nonce: 0,
                    token: this.token.token,
                    amounts: Object.values(amounts),
                    dsts: this.destinations.map (it => it.addressEncoded),
                    dstsAmounts: this.destinations.map (it => it.amount),
                    fee: {
                        fixed: (this.fee.feeType === 'feeAuto') ? 0 : this.fee.feeManual.amount,
                        perByte: 0,
                        perByteAuto: this.fee.feeType === 'feeAuto',
                    },
                    data: {
                        data: Buffer.from(this.extraData.data).toString("hex"),
                        encrypt: this.extraData.type === "encrypted",
                        publicKeyToEncrypt: this.extraData.publicKeyToEncrypt,
                    },
                    propagateTx: true,
                    awaitAnswer: true,
                } ), (status) => {
                    this.status = status
                }, password );

                if (!out) throw "Transaction couldn't be made";
                this.status = ''

                const tx = JSON.parse( MyTextDecode( out) )

                await this.$store.dispatch('includeTx', { tx } )

                await this.$store.dispatch('addToast', {
                    type: 'success',
                    title: `Transaction created`,
                    text: `A transaction has been made. \n TxId ${tx.hash}`,
                });

                this.$router.push(`/explorer/tx/${tx.hash}`);

            }catch(err){
                console.error(err);
                this.error = err.message;
            }

        },


    },

    mounted(){
    },

    async beforeDestroy() {
        if (this.destination && this.destination.address && this.destination.address.publicKey && !this.$store.getters.walletContains(this.destination.address.publicKey))
            await this.$store.dispatch('unsubscribeAccount', this.destination.address.publicKey )
    }

}

</script>

<style scoped>
</style>
