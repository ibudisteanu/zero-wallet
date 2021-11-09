<template>
    <wait-account :account="account">

        <wizard :titles="{...titlesOffset,
                0: {icon: 'fas fa-users', name: 'Receiver', tooltip: 'Receiver of the private tx' },
                1: {icon: 'fas fa-pencil-alt', name: 'Extra Info', tooltip: 'Extra information attached in the tx' },
                2: {icon: 'fas fa-eye-slash', name: 'Privacy', tooltip: 'Setting the ring members of the transaction' },
                3: {icon: 'fas fa-dollar-sign', name: 'Fee', tooltip: 'Setting the fee' } }"
                 @onSetTab="setTab" controls-class-name="card-footer bg-light" :buttons="buttons" class="card" >

            <template v-for="(_, index) in titlesOffset">
                <template :slot="`tab_${index}`">
                    <slot :name="`tab_${index}`"></slot>
                </template>
            </template>

            <template :slot="`tab_0`">
                <div class="form pb-2" v-if="allowDestinationRandom">
                    <input class="form-check-input" id="random-destination" type="checkbox"  name="checkbox" v-model="randomDestination"  >
                    <label class="form-check-label" for="random-destination">Random Destination with Zero amount</label>
                </div>
                <template v-if="!randomDestination">
                    <tx-asset v-if="!initAvailableAsset" :assets="availableAssets" @changed="changedAsset" class="pb-2"/>
                    <destination-address :text="text" :validateAmount="validateDestinationAmount" :balances="availableBalances" :allow-zero="allowDestinationZeroAmount" :asset="asset.asset" @changed="changedDestination" />
                </template>
            </template>

            <template :slot="`tab_1`">
                <extra-data :destinations="[destination]" :paymentId="identifiedPaymentID" @changed="changedExtraData" />
            </template>

            <template :slot="`tab_2`">

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

            </template>

            <template :slot="`tab_3`">
                <tx-fee :balances="availableBalances" :asset="asset" :allow-zero="true" @changed="changedFee" />
            </template>

            <template slot="wizard-footer">
                <alert-box v-if="error" class="w-100" type="error" :dismissible-timeout="10000" :dismissible-text="error" @onDismissible="error=''">{{error}}</alert-box>
                <template v-if="status">
                    <span class="d-block">Transaction is being created. It will take 1-2 minutes.</span>
                    <label class="d-block">Status: {{status}}</label>
                </template>
            </template>

        </wizard>
    </wait-account>
</template>

<script>
import WaitAccount from "../../wallet/account/wait-account";
import Account from "../../wallet/account/account";
import LoadingSpinner from "../../utils/loading-spinner";
import LoadingButton from "../../utils/loading-button";
import DestinationAddress from "../destination-address";
import TxAmount from "../tx-amount";
import ExtraData from "../extra-data";
import AlertBox from "../../utils/alert-box";
import TxFee from "../tx-fee";
import TxAsset from "../tx-asset";
import AccountIdenticon from "../../wallet/account/account-identicon";
import Wizard from "../../utils/wizard";

export default {
    components: {
        WaitAccount,  Account, LoadingSpinner, LoadingButton, DestinationAddress, TxAmount,
        ExtraData, AlertBox, TxFee, TxAsset, AccountIdenticon, Wizard,
    },

    props: {
        publicKey: {default: ""},
        titlesOffset: {default: () => ({}) }, //{icon, name}
        buttonsOffset: {default: () => ({}) },
        text: {default: "Destination"},
        initAvailableAsset: {default: null },
        initAvailableBalance: {default: null },
        allowDestinationRandom: {default: false},
        allowDestinationZeroAmount: {default: true},
        validateDestinationAmount: {default: true},
        beforeProcess: {default: null}, //function
        createNewSender: {default: false}, //function
    },


    data(){
        return {
            asset: (this.initAvailableAsset !== null) ? { asset: this.initAvailableAsset   } : { }, //contains asset.asset and asset.validation

            randomDestination: this.allowDestinationRandom,
            newSender: null,

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

            status: '',
            error: '',
        }
    },

    computed:{
        address(){
            return this.$store.state.wallet.addresses[this.publicKey] ;
        },
        account(){
            return this.$store.state.accounts.list[this.publicKey]
        },

        availableAssets(){
            return this.account && this.account.assets ? this.account.assets : null
        },

        availableAccounts(){
            return this.account && this.account.accounts ? this.account.accounts : null
        },

        availableBalances(){

            if (this.initAvailableBalance) return this.initAvailableBalance

            const accounts = this.availableAccounts || []
            for (const acc of accounts)
                if (acc.asset === this.asset.asset )
                    return {  [this.asset.asset]: acc }

            return null
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

        getAsset(){
            return this.$store.getters.getAsset( this.asset ? this.asset.asset : null );
        },

        buttons(){
            return {
                3: { icon: 'fa fa-credit-card', text: 'Sign Transaction' },
                ...this.buttonsOffset,
            }
        }
    },

    watch: {
        async destination (to, from){
            if (to === from) return

            await this.$store.state.blockchain.syncPromise;

            if (to && to.address && to.address.publicKey)
                await this.$store.dispatch('subscribeAccount', to.address.publicKey )

            if (from && from.address && from.address.publicKey && !this.$store.getters.walletContains(from) )
                await this.$store.dispatch('unsubscribeAccount', from.address.publicKey )

        },

        randomDestination(to, from){
            this.destination = {address: null, amount: 0}
        },

    },

    methods:{

        async setTab({resolve, reject, oldTab, value}){

            try{

                if (oldTab === 0 && value > oldTab){
                    if (this.asset.validationError) throw this.asset.validationError

                    if (!this.randomDestination){

                        if (this.checkDestinationError) throw this.checkDestinationError
                        if (this.destination.validationError) throw this.destination.validationError;

                        await this.$store.state.blockchain.syncPromise;
                        await this.$store.dispatch('subscribeAccount', this.destination.address.publicKey )

                        if (!this.$store.state.accounts.list[this.destination.address.publicKey] && !this.destination.address.registration )
                            throw "Destination Address doesn't have the registration. \n You have the shorter version of the address. First time when an address is used it requires the longer version."
                    }

                }else if (oldTab === 1 && value > oldTab) {
                    if (this.extraData.validationError) throw this.extraData.validationError
                }else if (oldTab === 2 && value > oldTab) {
                    if (this.ringSize !== this.ringMembers.length) throw `Ring members are not generated well ${this.ringSize} vs ${this.ringMembers.length} `
                }else if (oldTab === 3 && value > oldTab){
                    if (this.fee.feeAuto.validationError) throw this.fee.feeAuto.validationError
                    if (this.fee.feeManual.validationError) throw this.fee.feeManual.validationError

                    await this.handleSendFunds()
                }else
                    return this.$emit('onSetTab', {resolve, reject, oldTab, value} )

            }catch(err) {
                reject(err)
            }finally{
                resolve(true)
            }
        },

        changedDestination(data){
            this.destination = { ...this.destination,  ...data, }
        },
        changedAsset(data){
            this.asset = { ...this.asset,  ...data, }
        },
        changedFee(data){
            this.fee = { ...this.fee,  ...data, }
        },
        changedExtraData(data){
            this.extraData = { ...this.extraData,  ...data, }
        },

        async handleGenerateRing(resolver){

            try{

                const asset = this.asset.asset

                const holders = await PandoraPay.network.getNetworkAccountsCount( asset )

                const ringSize = this.ringSize
                const newAccounts = this.ringNewAddresses

                if (ringSize < 0 ) throw "RingSize can not be negative"
                if ( (Math.log(ringSize)/Math.log(2)) % 1 !== 0 ) throw "RingSize needs to be power of 2"
                if ( ringSize > 256 ) throw "RingSize max supported is 256"

                if ( newAccounts < 0 || newAccounts > ringSize-2) throw "New accounts needs to be in the interval [0, ringSize-2]"

                const alreadyUsedIndexes = {}

                if (!this.createNewSender){
                    if (!this.availableAccounts || !this.availableAccounts.length ) throw "You don't have any available private funds"

                    let foundSender = false
                    for (let i=0; i < this.availableAccounts.length; i++)
                        if (this.availableAccounts[i].asset === asset){
                            alreadyUsedIndexes[this.availableAccounts[i].index] = true
                            foundSender = true
                            break
                        }
                    if (!foundSender) throw "Account not found for sender"
                }

                if (!this.randomDestination)
                    if (this.$store.state.accounts.list[ this.destination.address.publicKey]){
                        let availableAccounts = this.$store.state.accounts.list[ this.destination.address.publicKey]
                        for (let i=0; i < availableAccounts.length; i++)
                            if (availableAccounts.asset === asset)
                                alreadyUsedIndexes[availableAccounts.index] = true
                    }

                const count = Math.min( holders, ringSize - Object.keys(alreadyUsedIndexes).length )
                for (let i=0; i < count; i++){

                    let index = await PandoraPay.helpers.randomUint64N( holders.toString() )
                    while (alreadyUsedIndexes[index])
                        index = await PandoraPay.helpers.randomUint64N( holders.toString() )

                    alreadyUsedIndexes[index] = true
                }

                const alreadyUsedIndexesArray = Object.keys(alreadyUsedIndexes).map(it => Number.parseInt(it) )
                alreadyUsedIndexesArray.sort((a,b) => a - b )

                const out = await PandoraPay.network.getNetworkAccountsKeysByIndex( MyTextEncode( JSON.stringify({
                    indexes: alreadyUsedIndexesArray,
                    asset: asset,
                    encodeAddresses: false,
                })));

                let publicKeys = JSON.parse( MyTextDecode( out ) ).publicKeys

                const publicKeysMap = {}
                publicKeys.map( it => publicKeysMap[it] = true )

                function getRandomPublicKey(){
                    const keys = Object.keys(publicKeysMap)
                    let index = Math.floor(Math.random() * keys.length )
                    const publicKeySelected = keys[index]
                    delete publicKeysMap[publicKeySelected]
                    return publicKeySelected
                }

                let ringMembers = []

                if (!this.createNewSender){
                    ringMembers.push(this.address.addressEncoded)
                    delete publicKeysMap[this.address.publicKey]
                }else {
                    const json = JSON.parse( MyTextDecode( await PandoraPay.addresses.generateNewAddress() ) )
                    ringMembers.push( json[1] )
                    this.newSender = {privateKey: json[0], addressEncoded: json[1], publicKey: json[2] }
                }

                if (this.randomDestination){
                    const destinationPublicKey = getRandomPublicKey()

                    const json = JSON.parse( MyTextDecode( await PandoraPay.addresses.generateAddress( MyTextEncode( JSON.stringify( {publicKey: destinationPublicKey, registration: "", amount: 0, paymentId: ""} ) ) ) ) )
                    this.destination = {amount: 0, addressEncoded: json[1], address: { publicKey: destinationPublicKey }}
                }

                ringMembers.push(this.destination.addressEncoded)
                delete publicKeysMap[this.destination.address.publicKey]

                for ( let i =0; ringMembers.length < ringSize - newAccounts; i++){
                    const publicKeySelected = getRandomPublicKey()
                    const json = JSON.parse( MyTextDecode( await PandoraPay.addresses.generateAddress( MyTextEncode( JSON.stringify( {publicKey: publicKeySelected, registration: "", amount: 0, paymentId: ""} ) ) ) ) )
                    ringMembers.push( json[1] )
                }

                for (let i=0; ringMembers.length < ringSize; i++){
                    const json = JSON.parse( MyTextDecode( await PandoraPay.addresses.generateNewAddress() ) )
                    ringMembers.push( json[1] )
                }

                this.ringMembers = ringMembers

            }catch(err){
                this.error = err.toString()
            }finally{
                resolver()
            }

        },

        async handleSendFunds(){

            this.status = '';

            const password = await this.$store.state.page.refWalletPasswordModal.showModal()
            if (password === null ) return

            let senderPrivateKey, senderBalanceDecoded
            if (!this.createNewSender){

                let balance
                for (const availableAccount of this.availableAccounts)
                    if (availableAccount.asset === this.asset.asset){
                        balance = availableAccount.balance
                        break
                    }

                const out = await this.$store.state.page.refDecodeHomomorphicBalanceModal.showModal( this.$store.state.wallet.mainPublicKey, balance, this.asset.asset, true, password )
                if (out.balanceDecoded === null) throw "Decoding was canceled"

                senderPrivateKey = out.privateKey
                senderBalanceDecoded = out.balanceDecoded
            }else {
                senderPrivateKey = this.newSender.privateKey
                senderBalanceDecoded = this.availableBalances[ this.asset.asset ].amount
            }

            let asset = this.asset.asset

            const accs = { [asset]: {} }
            const regs = {}

            const shuffle =  JSON.parse( MyTextDecode( await PandoraPay.helpers.shuffleArray_for_Zether( this.ringMembers.length.toString()  )) )
            const ringShuffle = shuffle.map( it => this.ringMembers[it] )

            const ringShufflePublicKeys = await Promise.all( ringShuffle.map( async it => JSON.parse( MyTextDecode( await PandoraPay.addresses.decodeAddress(it) )).publicKey ) )

            const outData = await PandoraPay.network.getNetworkAccountsByKeys(MyTextEncode(JSON.stringify({
                keys: ringShufflePublicKeys.map(it => ({publicKey: it }) ),
                asset,
                includeMempool: true,
            })))

            let out = JSON.parse( MyTextDecode( outData ) )

            for (let i=0; i < out.accSerialized.length; i++){
                accs[asset][ringShufflePublicKeys[i]] = out.accSerialized[i]
                regs[ringShufflePublicKeys[i]] = out.registrationSerialized[i]
            }

            const amount = Number.parseInt( await PandoraPay.config.assets.assetsConvertToUnits( this.destination.amount.toString(), this.getAsset.decimalSeparator ) )
            const fee = (this.fee.feeType === 'feeAuto') ? 0 : Number.parseInt( await PandoraPay.config.assets.assetsConvertToUnits( this.fee.feeManual.amount.toString(), this.getAsset.decimalSeparator ) )

            const data = {
                from: [{
                    privateKey: senderPrivateKey,
                    balanceDecoded: senderBalanceDecoded,
                }],
                assets: [ asset ],
                amounts: [ amount  ],
                dsts: [ this.destination.addressEncoded ],
                burns: [ 0 ],
                ringMembers: [ this.ringMembers ],
                fees: [{
                    fixed:  fee,
                    perByte: 0,
                    perByteAuto: this.fee.feeType === 'feeAuto',
                }],
                data: [{
                    data: Buffer.from(this.extraData.data).toString("hex"),
                    encrypt: this.extraData.type === "encrypted",
                }],
                payloadExtra: [ null ],
                payloadScriptType: [  PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_TRANSFER ],
                height: this.$store.state.blockchain.end,
                hash: this.$store.state.blockchain.hash,
                accs,
                regs,
            }

            if (this.beforeProcess)
                await this.beforeProcess(password, data)

            //compute extra
            out = await PandoraPayHelper.transactions.builder.createZetherTx( MyTextEncode( JSON.stringify( data ) ),
                status => {
                    this.status = status
                } );

            if (!out) throw "Transaction couldn't be made";
            this.status = 'Propagating transaction...'

            const tx = JSON.parse( MyTextDecode( out[0] ) )
            const txSerialized = out[1]

            const finalAnswer = await PandoraPay.network.postNetworkMempoolBroadcastTransaction( txSerialized )
            if (!finalAnswer) throw "Transaction couldn't be broadcasted"

            await this.$store.dispatch('includeTx', { tx, mempool: false } )

            this.$router.push(`/explorer/tx/${tx.hash}`);

        },


    },

    mounted(){
    },

    async beforeDestroy() {
        this.destination = {  }
    }

}
</script>