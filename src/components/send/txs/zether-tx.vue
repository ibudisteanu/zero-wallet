<template>
    <wait-account :account="account" :type="initAvailableBalance ? 'all' : 'zether'">

        <wizard :titles="{...titlesOffset,
            0: {icon: 'fas fa-users', name: 'Recipient', tooltip: 'Recipient of the private tx' },
            1: {icon: 'fas fa-pencil-alt', name: 'Memo', tooltip: 'Extra information attached in the tx' },
            2: {icon: 'fas fa-eye-slash', name: 'Privacy', tooltip: 'Setting the ring members of the transaction' },
            3: {icon: 'fas fa-dollar-sign', name: 'Fee', tooltip: 'Setting the fee' },
            4: {icon: 'fas fa-search-dollar', name: 'Preview', tooltip: 'Preview the transaction before Propagating' } }"
                @onSetTab="setTab" controls-class-name="card-footer bg-light" :buttons="buttons" class="card" ref="refWizard" >

            <template v-for="(_, index) in titlesOffset" v-slot:[getTabSlotName(index)]>
                <slot :name="`tab_${index}`"></slot>
            </template>

            <template v-slot:tab_0>
                <div class="form-check" v-if="allowRandomRecipient">
                    <input class="form-check-input" id="random-recipient" type="checkbox"  name="checkbox" v-model="randomRecipient">
                    <label class="form-check-label" for="random-recipient">Random Recipient with Zero amount</label>
                </div>
                <template v-if="!randomRecipient">
                    <tx-recipient :init-available-asset="initAvailableAsset" :available-assets="availableAssets" :text="text" :validate-amount="validateRecipientAmount" :balances="availableBalances" :allow-zero="allowRecipientZeroAmount" @changed="changedRecipient" />
                </template>
            </template>

            <template v-slot:tab_1>
                <extra-data :recipients="recipient ? [recipient] : null" :paymentID="identifiedPaymentID" @changed="changedExtraData" />
            </template>

            <template v-slot:tab_2>

                <div class="row">
                    <div class="col-12 col-md-6">
                        <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Ring Size</label>
                        <i class="fas fa-question " v-tooltip.bottom="`Bigger the ring, more private is your transaction.`" />
                        <select class="form-select" v-model.number="ringSize">
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
                        <i class="fas fa-question " v-tooltip.bottom="`Number of new addresses in the ring. Makes fresh new recipients more private.`" />
                        <input class="form-control"  type="number" v-model.number="ringNewAddresses" />
                    </div>
                </div>

                <div class="col-12 pt-4">
                    <loading-button text="Generate Ring" @submit="handleGenerateRing" icon="fas fa-cogs" />
                </div>

                <div class="col-12 pt-4">
                    <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Sender Ring Members</label>
                    <i class="fas fa-question " v-tooltip.bottom="`Preview of the Ring Members used for your private transaction.`" />
                    <div class="pt-2">
                        <div v-for="(ringMember, index) in ringSenderMembers" class="d-inline-block"
                             :key="`ring_member_${index}`">
                            <account-identicon :address="ringMember" size="21" outer-size="7" :disable-route="true" />
                        </div>
                    </div>
                </div>
                <div class="col-12 pt-1">
                  <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Recipient Ring Members</label>
                  <i class="fas fa-question " v-tooltip.bottom="`Preview of the Ring Members used for your private transaction.`" />
                  <div class="pt-2">
                    <div v-for="(ringMember, index) in ringRecipientMembers" class="d-inline-block"
                         :key="`ring_member_${index}`">
                      <account-identicon :address="ringMember" size="21" outer-size="7" :disable-route="true" />
                    </div>
                  </div>
                </div>

            </template>

            <template v-slot:tab_3>
                <tx-fee :balances="availableBalances" :asset="recipient.asset" :allow-zero="true" @changed="changedFee" />

                <template v-if="recipient.asset !== PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64">
                    <div class="form-check pt-2">
                        <input class="form-check-input" id="assetFeeLiquidityAsset" type="checkbox" v-model="assetFeeLiquidityAsset" />
                        <label class="form-check-label" for="assetFeeLiquidityAsset">Automatically Determine Asset Fee Liquidity</label>
                    </div>
                    <div class="row" v-if="!assetFeeLiquidityAsset">
                        <div class="col-12 col-sm-6">
                            <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Conversion Rate</label>
                            <i class="fas fa-question" v-tooltip.bottom="`Conversion rate of the asset fee`" />
                            <input :class="`form-control ${validationAssetFeeConversionRate ? 'is-invalid' :''}`" type="number" v-model.number="assetFeeConversionRate" min="0" :step="0.0000000001">
                        </div>
                    </div>
                </template>

            </template>

            <template v-slot:tab_4>
                <confirm-broadcasting-tx v-if="tx" class="my-3 fs--1" :tx="tx" />
            </template>

            <template #wizard-footer>
                <alert-box v-if="error" class="w-100" type="error" :dismissible-timeout="10000" :dismissible-text="error" @onDismissible="error=''">{{error}}</alert-box>

                <div class="alert alert-info" v-if="status && statusType === 'signing'" role="alert">
                    <h4 class="alert-heading fw-semi-bold">Signing Tx...</h4>
                    <p>Transaction is being created. It will take 1-2 minutes.</p>
                    <hr>
                    <p class="mb-0">Status: {{status}}</p>
                </div>

                <div class="alert alert-info" v-if="status && statusType === 'broadcasting'" role="alert">
                    <h4 class="alert-heading fw-semi-bold">Broadcasting Tx...</h4>
                    <p>Your Tx is being broadcasting. It should take 20 seconds max.</p>
                    <hr>
                    <p class="mb-0">Status: {{status}}</p>
                </div>

            </template>

        </wizard>
    </wait-account>
</template>

<script>
import WaitAccount from "../../wallet/account/wait-account";
import Account from "../../wallet/account/account";
import LoadingSpinner from "../../utils/loading-spinner";
import LoadingButton from "../../utils/loading-button";
import TxRecipient from "../tx-recipient";
import TxAmount from "../tx-amount";
import ExtraData from "../extra-data";
import AlertBox from "../../utils/alert-box";
import TxFee from "../tx-fee";
import TxAsset from "../tx-asset";
import AccountIdenticon from "../../wallet/account/account-identicon";
import Wizard from "../../utils/wizard";
import ConfirmBroadcastingTx from "./confirm-broadcasting-tx"
import Decimal from 'decimal.js';
export default {

    components: {
        WaitAccount,  Account, LoadingSpinner, LoadingButton, TxRecipient, TxAmount,
        ExtraData, AlertBox, TxFee, TxAsset, AccountIdenticon, Wizard, ConfirmBroadcastingTx,
    },

    props: {
        publicKey: {default: ""},
        titlesOffset: {default: () => ({}) }, //{icon, name}
        buttonsOffset: {default: () => ({}) },
        text: {default: "Recipient"},
        initAvailableAsset: {default: null },
        initAvailableBalance: {default: null },
        allowRandomRecipient: {default: false},
        allowRecipientZeroAmount: {default: true},
        validateRecipientAmount: {default: true},
        beforeProcess: {default: null}, //function
        createNewSender: {default: false}, //function
    },


    data(){
        return {

            randomRecipient: this.allowRandomRecipient,
            newSender: null,

            recipient: {
                address: null,
                addressEncoded: "",
                addressValidationError: "",
                amount: 0,
                amountValidationError: "",
                asset: (this.initAvailableAsset !== null) ? this.initAvailableAsset : null,
                assetValidationError: "",
            },

            fee: {  },
            assetFeeLiquidityAsset: true,
            assetFeeConversionRate: 1,

            extraData: {
                data: "",
                type: "public",
                publicKeyToEncrypt: "",
                validationError: null,
            },

            ringSize: 32,
            ringNewAddresses: 0,
            ringSenderMembers: [],
            ringRecipientMembers: [],

            tx: null,
            txSerialized: null,

            status: '',
            error: '',
            statusType: ""
        }
    },

    computed:{
        PandoraPay: () => PandoraPay,

        walletAddress(){
            return this.$store.state.wallet.addresses[this.publicKey] ;
        },
        account(){
            return this.$store.state.accounts.list[this.publicKey]
        },

        availableAccounts(){
            return this.account && this.account.accounts ? this.account.accounts : null
        },

        availableAssets(){
            return this.availableAccounts ? this.availableAccounts.map(it => it.asset) : null
        },

        availableBalances(){

            if (this.initAvailableBalance) return this.initAvailableBalance

            const accounts = this.availableAccounts || []
            for (const acc of accounts)
                if (acc.asset === this.recipient.asset )
                    return {  [this.recipient.asset]: acc }

            return null
        },

        checkRecipientError(){

            try{

                if (this.recipient.address)
                    if (this.recipient.address.publicKey === this.walletAddress.publicKey) throw "Recipient can not be the same with from";

            }catch (err){
                return err.toString()
            }

        },

        validationAssetFeeConversionRate(){
            try{

            }catch(err){
                return err.toString()
            }
        },

        identifiedPaymentID(){
            if (this.recipient.address) {
                if (this.recipient.address.paymentID)
                    return this.recipient.address.paymentID
            }
        },

        getAsset(){
            return this.$store.getters.getAsset( this.asset ? this.recipient.asset : null );
        },

        buttons(){
            return {
                3: { icon: 'fas fa-file-signature', text: 'Sign Transaction' },
                4: { icon: 'fas fa-globe-americas', text: 'Propagate Transaction' },
                ...this.buttonsOffset,
            }
        }
    },

    watch: {
        async recipient (to, from){
            if (to === from) return

            await this.$store.state.blockchain.syncPromise;

            if (to && to.address && to.address.publicKey && !this.$store.getters.walletContains(to.address.publicKey) )
                await this.$store.dispatch('subscribeAccount', {publicKey: to.address.publicKey} )

            if (from && from.address && from.address.publicKey && !this.$store.getters.walletContains(from.address.publicKey) )
                await this.$store.dispatch('unsubscribeAccount', from.address.publicKey )

        },

        randomRecipient(to, from){
            this.recipient = {address: null, amount: new Decimal(0) }
        },

    },

    methods:{

        getTabSlotName(index){
            return `tab_${index}`
        },

        async setTab({resolve, reject, oldTab, value}){

            try{

                this.status = ""

                if (oldTab === 0 && value > oldTab){

                    if (!this.randomRecipient){

                        if (this.recipient.addressValidationError) throw this.recipient.addressValidationError;
                        if (this.recipient.amountValidationError) throw this.recipient.amountValidationError;
                        if (this.recipient.assetValidationError) throw this.recipient.assetValidationError;
                        if (this.checkRecipientError) throw this.checkRecipientError

                        await this.$store.state.blockchain.syncPromise;
                        await this.$store.dispatch('subscribeAccount', {publicKey: this.recipient.address.publicKey} )

                        if (!this.$store.state.accounts.list[this.recipient.address.publicKey] && !this.recipient.address.registration )
                            throw "Recipient Address doesn't have the registration. \n You have the shorter version of the address. First time when an address is used it requires the longer version."
                    }

                }else if (oldTab === 1 && value > oldTab) {
                    if (this.extraData.validationError) throw this.extraData.validationError
                }else if (oldTab === 2 && value > oldTab) {
                    if (!this.ringSenderMembers.length || !this.ringRecipientMembers.length)
                        await this.handleGenerateRing()

                    if (this.ringSize/2 !== this.ringSenderMembers.length) throw `Ring Sender members are not generated well ${this.ringSize/2} vs ${this.ringSenderMembers.length} `
                    if (this.ringSize/2 !== this.ringRecipientMembers.length) throw `Ring Sender members are not generated well ${this.ringSize/2} vs ${this.ringRecipientMembers.length} `
                }else if (oldTab === 3 && value > oldTab) {
                    if (this.fee.feeAuto.validationError) throw this.fee.feeAuto.validationError
                    if (this.fee.feeManual.validationError) throw this.fee.feeManual.validationError

                    await this.handleSendFunds()
                }else if (oldTab === 4 && value > oldTab) {
                  try{
                    await this.handlePropagateTx()
                  }catch(e){
                    this.status = ""
                    this.error = e
                    setTimeout(()=>{
                      this.$refs.refWizard.setTab(resolve, 3 )
                    }, 1000)
                  }
                } else return this.$emit('onSetTab', {resolve, reject, oldTab, value} )

            }catch(err) {
                console.error(err)
                reject(err)
            }finally{
                resolve(true)
            }
        },

        changedRecipient(data){
            this.recipient = { ...this.recipient,  ...data, }
        },
        changedFee(data){
            this.fee = { ...this.fee,  ...data, }
        },
        changedExtraData(data){
            this.extraData = { ...this.extraData,  ...data, }
        },

        async handleGenerateRing(resolver){

            try {

                const asset = this.recipient.asset

                let assetCollector

                if (asset !== PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64){
                    const outData = await PandoraPay.network.getNetworkFeeLiquidity(0, asset)
                    if (!outData) throw "No Asset Fee Liqiduity for this asset"
                    const out = JSONParse(MyTextDecode(outData))
                    assetCollector = out.collector
                }

                const holdersData = await PandoraPay.network.getNetworkAccountsCount( asset )
                const holders = JSONParse(MyTextDecode(holdersData)).count

                const ringSize = this.ringSize
                let newAccounts = this.ringNewAddresses

                if (ringSize < 0 ) throw "RingSize can not be negative"
                if ( (Math.log(ringSize)/Math.log(2)) % 1 !== 0 ) throw "RingSize needs to be power of 2"
                if ( ringSize > 256 ) throw "RingSize max supported is 256"

                if ( newAccounts < 0 || newAccounts > ringSize-2) throw "New accounts needs to be in the interval [0, ringSize-2]"

                const alreadyUsedAllIndexes = {}
                let senderAlreadyUsedIndexes = {}, recipientAlreadyUsedIndexes = {}

                if (!this.createNewSender){
                    if (!this.availableAccounts || !this.availableAccounts.length ) throw "You don't have any available private funds"

                    let foundSender = false
                    for (let i=0; i < this.availableAccounts.length; i++)
                        if (this.availableAccounts[i].asset === asset){
                            senderAlreadyUsedIndexes[this.availableAccounts[i].index] = true
                            alreadyUsedAllIndexes[this.availableAccounts[i].index] = true
                            foundSender = true
                            break
                        }
                    if (!foundSender) throw "Account not found for sender"
                }

                if (!this.randomRecipient)
                    if (this.$store.state.accounts.list[ this.recipient.address.publicKey]){
                        let availableAccounts = this.$store.state.accounts.list[ this.recipient.address.publicKey]
                        if (availableAccounts)
                            for (let i=0; i < availableAccounts.length; i++)
                                if (availableAccounts.asset === asset) {
                                  recipientAlreadyUsedIndexes[availableAccounts[i].index] = true
                                  alreadyUsedAllIndexes[availableAccounts[i].index] = true
                                }
                    }

                let ringSenderMembers = [], ringRecipientMembers = []

                let step = -1
                while (ringSenderMembers.length < ringSize /2 || ringRecipientMembers.length < ringSize / 2  ){

                    step++
                    if (step > 0){
                      senderAlreadyUsedIndexes = {}
                      recipientAlreadyUsedIndexes = {}
                    }

                    async function getRandomAccounts(alreadyUsedIndexes){

                      if ( holders.gt(2) ) {
                        const count = Decimal.min( holders, ringSize/2 ).minus(Object.keys(alreadyUsedIndexes).length)
                        for (let i = new Decimal(0); i.lt(count); i = i.plus(1)){

                          let trials = 0

                          let index = await PandoraPay.helpers.randomUint64N( holders.toString() )
                          while ( alreadyUsedAllIndexes[index] && trials < 10) {
                            index = await PandoraPay.helpers.randomUint64N(holders.toString())
                            trials++
                          }

                          if (trials > 10) break

                          alreadyUsedIndexes[index] = true
                          alreadyUsedAllIndexes[index] = true
                        }
                      }

                    }

                    await getRandomAccounts(senderAlreadyUsedIndexes)
                    await getRandomAccounts(recipientAlreadyUsedIndexes)

                    const alreadyUsedIndexesArray = Object.keys(senderAlreadyUsedIndexes).map(it => new Decimal(it)).concat( Object.keys(recipientAlreadyUsedIndexes).map(it => new Decimal(it)) )
                    alreadyUsedIndexesArray.sort((a,b) => a.minus( b ) )

                    let outData = await PandoraPay.network.getNetworkAccountsKeysByIndex( MyTextEncode( JSONStringify({
                      indexes: alreadyUsedIndexesArray,
                      asset: asset,
                      encodeAddresses: false,
                    })));

                    const publicKeys = JSONParse( MyTextDecode( outData ) ).publicKeys

                    const senderAlreadyUsedIndexesMap = {}, recipientAlreadyUsedIndexesMap = {}

                    alreadyUsedIndexesArray.map( (index, i) => {
                      if (senderAlreadyUsedIndexes[index]) senderAlreadyUsedIndexesMap[publicKeys[i]] = true
                      if (recipientAlreadyUsedIndexes[index]) recipientAlreadyUsedIndexesMap[publicKeys[i]] = true
                    } )

                    outData = await PandoraPay.network.getNetworkAccountsByKeys(MyTextEncode( JSONStringify({
                      keys: publicKeys.map(it => ({publicKey: it }) ),
                      asset,
                      includeMempool: true,
                    })))

                    const senderPublicKeysMap = {}, recipientPublicKeysMap = {}

                    const accountsData = JSONParse( MyTextDecode( outData ) )
                    for (let i=0; i < publicKeys.length; i++) {
                      if (publicKeys[i] !== assetCollector)

                        if (recipientAlreadyUsedIndexesMap[publicKeys[i]]) recipientPublicKeysMap[publicKeys[i]] = true
                        else if ( (!accountsData.registration[i] || !accountsData.registration[i].spendPublicKey) ) //making sure it doesn't have a spendPublicKey
                          senderPublicKeysMap[publicKeys[i]] = true
                    }

                    async function getRandomPublicKey(publicKeysMap){

                      let publicKeysList = Object.keys(publicKeysMap)
                      if (!publicKeysList.length) return null

                      let index = Math.floor(Math.random() * publicKeysList.length )
                      const publicKeySelected = publicKeysList[index]
                      delete publicKeysMap[publicKeySelected]

                      const json = JSONParse( MyTextDecode( await PandoraPay.addresses.createAddress( MyTextEncode( JSONStringify( {publicKey: publicKeySelected, registration: "", paymentID: "", paymentAmount: 0, paymentAsset: "" } ) ) ) ) )
                      return {addressEncoded: json[1], publicKey: publicKeySelected}

                    }

                    if (step === 0){

                      if (!this.createNewSender){
                        ringSenderMembers.push(this.walletAddress.addressEncoded)
                        delete senderPublicKeysMap[this.walletAddress.publicKey]
                      }else {
                        const json = JSONParse( MyTextDecode( await PandoraPay.addresses.generateNewAddress( MyTextEncode( JSONStringify( { registration: true, staked: Math.random() < 0.1 } ) ) ) ) )
                        ringSenderMembers.push( json[1] )
                        this.newSender = {privateKey: json[0], addressEncoded: json[1], publicKey: json[2] }
                      }

                      if (this.randomRecipient){
                        const out = await getRandomPublicKey(recipientPublicKeysMap)
                        this.recipient =  {
                          addressEncoded: out.addressEncoded,
                          address: { publicKey: out.publicKey },
                          addressValidationError:"",
                          amount: new Decimal(0),
                          amountValidationError: "",
                          asset,
                          assetValidationError: "",
                        }
                      }

                      ringRecipientMembers.push(this.recipient.addressEncoded)
                      delete recipientPublicKeysMap[this.recipient.address.publicKey]

                      if (holders.lt(ringSize))
                        newAccounts = ringSize

                      for (let i=0; i < newAccounts && ringRecipientMembers.length < ringSize/2; i++){
                        const json = JSONParse( MyTextDecode( await PandoraPay.addresses.generateNewAddress( MyTextEncode( JSONStringify( { registration: true, staked: Math.random() < 0.1 } ) ) ) ) )
                        ringRecipientMembers.push( json[1] )
                      }

                    }

                    for ( let i =0; ringSenderMembers.length < ringSize / 2; i++){
                      const out = await getRandomPublicKey(senderPublicKeysMap)
                      if (!out) break
                      ringSenderMembers.push( out.addressEncoded )
                    }

                    for ( let i =0; ringRecipientMembers.length < ringSize / 2; i++){
                      const out = await getRandomPublicKey(recipientPublicKeysMap)
                      if (!out) break
                      ringRecipientMembers.push( out.addressEncoded )
                    }

                  }

                  this.ringSenderMembers = ringSenderMembers
                  this.ringRecipientMembers = ringRecipientMembers

            }catch(err){
                this.error = err.toString()
            }finally{
                if (resolver) resolver()
            }

        },

        async handleSendFunds(){

            this.statusType = "signing"
            this.status = '';

            const asset = this.recipient.asset

            const password = await this.$store.state.page.refWalletPasswordModal.showModal()
            if (password === null ) return

            let senderPrivateKey, senderDecryptedBalance, senderSpendPrivateKey
            if (!this.createNewSender){

                let balance
                for (const availableAccount of this.availableAccounts)
                    if (availableAccount.asset === asset){
                        balance = availableAccount.balance
                        break
                    }

                const out = await this.$store.state.page.refDecryptBalanceModal.showModal( this.$store.state.wallet.mainPublicKey, balance, asset, true, password )
                if (out.decryptedBalance === null) throw "Decrypting was canceled"

                senderPrivateKey = out.privateKey
                senderSpendPrivateKey = out.spendPrivateKey
                senderDecryptedBalance = out.decryptedBalance
            }else {
                senderPrivateKey = this.newSender.privateKey
                senderSpendPrivateKey = null
                senderDecryptedBalance = this.availableBalances[ asset ].amount
            }

            const accs = { [asset]: {} }
            const regs = {}

            const list = this.ringSenderMembers.concat(this.ringRecipientMembers)

            const shuffle =  JSONParse( MyTextDecode( await PandoraPay.helpers.shuffleArray_for_Zether( list.length.toString()  )) )
            const ringShuffle = shuffle.map( it => list[it] )

            const ringShufflePublicKeys = await Promise.all( ringShuffle.map( async it => JSONParse( MyTextDecode( await PandoraPay.addresses.decodeAddress(it) )).publicKey ) )

            let outData = await PandoraPay.network.getNetworkAccountsByKeys(MyTextEncode( JSONStringify({
              keys: ringShufflePublicKeys.map(it => ({publicKey: it }) ),
              asset,
              includeMempool: true,
            })))

            let out = JSONParse( MyTextDecode( outData ) )

            for (let i=0; i < out.accountSerialized.length; i++){
              accs[asset][ringShufflePublicKeys[i]] = out.accountSerialized[i]
              regs[ringShufflePublicKeys[i]] = out.registrationSerialized[i]
            }

            const amount = this.recipient.amount
            const fee = this.fee.feeType ? 0 : this.fee.feeManual.amount

            let feeRate = 0, feeLeadingZeros = 0

            if (asset !== PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64)
                if (this.assetFeeLiquidityAsset){
                    outData = await PandoraPay.network.getNetworkFeeLiquidity(0, asset)
                    if (!outData) throw "No Asset Fee Liqiduity for this asset"
                    out = JSONParse( MyTextDecode(outData))

                    feeRate = out.rate
                    feeLeadingZeros = out.leadingZeros
                }else {

                    const parts = this.assetFeeConversionRate.toString().split(".")
                    if (parts.length > 1)
                        feeLeadingZeros = parts[1].length

                    feeRate = new Decimal( this.assetFeeConversionRate ).mul( new Decimal(10).pow( feeLeadingZeros) )
                }


            const data = {
                payloads:[
                  {
                    sender: {
                      privateKey: senderPrivateKey,
                      spendPrivateKey: senderSpendPrivateKey,
                      decryptedBalance: senderDecryptedBalance,
                    },
                    asset: asset,
                    amount: amount ,
                    recipient: this.recipient.addressEncoded,
                    burn: new Decimal(0),
                    ringSenderMembers: this.ringSenderMembers,
                    ringRecipientMembers: this.ringRecipientMembers,
                    fees: {
                      fixed:  fee,
                      perByte: new Decimal(0),
                      perByteExtraSpace: new Decimal(0),
                      perByteAuto: this.fee.feeType,
                      rate: feeRate,
                      leadingZeros: feeLeadingZeros,
                    },
                    data: {
                      data: this.identifiedPaymentID ? this.extraData.data : Buffer.from( this.extraData.data ).toString("base64"),
                      encrypt: this.extraData.type === "encrypted",
                    },
                    extra: null,
                    scriptType: PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_TRANSFER,
                  },
                ],
                chainKernelHeight: this.$store.state.blockchain.end-1,
                chainKernelHash: this.$store.state.blockchain.kernelHash,
                accs,
                regs,
            }

            if (this.beforeProcess)
                await this.beforeProcess(password, data)

            //compute extra
            out = await PandoraPayHelper.transactions.builder.createZetherTx( MyTextEncode( JSONStringify( data ) ),
                status => {
                    this.status = status
                } );

            if (!out) throw "Transaction couldn't be made";

            this.status = "Tx built"

            this.tx = JSONParse( MyTextDecode( out[0] ) )
            const serialized = out[1]

            const txSerialized = Buffer.alloc(serialized.length)
            Buffer.from(serialized).copy(txSerialized, 0)

            this.tx._serialized = txSerialized.toString("base64")
            this.txSerialized = txSerialized

            this.status = ""

        },

        async handlePropagateTx(){

            this.statusType = "broadcasting"
            this.status = 'Cloning transaction...'

            this.status = 'Broadcasting your transaction in the network... Please wait...'

            await this.$store.dispatch('includeTx', { tx: this.tx, serialized: this.tx._serialized, mempool: false } )

            const finalAnswer = await PandoraPay.network.postNetworkMempoolBroadcastTransaction( this.txSerialized )
            if (!finalAnswer){
              this.$store.commit('deleteTransactions', [this.tx] )
              throw "Transaction couldn't be broadcast"
            }

            this.$router.push(`/explorer/tx/${Buffer.from(this.tx.hash, "base64").toString("hex")}`);

            this.$emit('onBroadcast', {tx: this.tx} )
        },

    },

    mounted(){
        const probability = Math.random()
        if (probability < 0.8) this.ringNewAddresses = 0
        else if (probability < 0.9) this.ringNewAddresses = 1
        else this.ringNewAddresses = 2

        const probability2 = Math.random()
        if (probability2 < 0.4) this.ringSize = 32
        else if (probability2 < 0.6) this.ringSize = 64
        else if (probability2 < 0.8) this.ringSize = 128
        else this.ringSize = 256
    },

    beforeUnmount() {
        this.recipient = {  }
    }

}
</script>
