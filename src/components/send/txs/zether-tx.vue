<template>
    <wait-account :address="address" :account="account">

        <wizzard :titles="[ ...titlesOffset,
                {icon: 'fas fa-users', name: 'Receiver', tooltip: 'Receiver of the private tx' },
                {icon: 'fas fa-pencil-alt', name: 'Extra Info', tooltip: 'Extra information attached in the tx' },
                {icon: 'fas fa-eye-slash', name: 'Privacy', tooltip: 'Setting the ring members of the transaction' },
                {icon: 'fas fa-dollar-sign', name: 'Fee', tooltip: 'Setting the fee' }]"
                 @onSetTab="setTab" controls-class-name="card-footer bg-light" :buttons="buttons" class="card" >

            <template v-for="(_, index) in new Array(tabsOffset+1)">
                <template :slot="`tab_${index}`">
                    <slot :name="`tab_${index}`"></slot>
                </template>
            </template>

            <template :slot="`tab_${tabsOffset}`">
                <tx-asset :assets="availableAssets" @changed="changedAsset" class="pb-4" />

                <destination-address :asset="asset.asset"
                                     @changed="changedDestination">
                </destination-address>

                <alert-box v-if="checkDestinationError" class="w-100" type="error">{{checkDestinationError}}</alert-box>

            </template>

            <template :slot="`tab_${tabsOffset+1}`">
                <extra-data :destinations="[destination]" class="pt-4"
                            :paymentId="identifiedPaymentID"
                            @changed="changedExtraData" />
            </template>

            <template :slot="`tab_${tabsOffset+2}`">

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

            </template>

            <template :slot="`tab_${tabsOffset+3}`">
                <tx-fee :balances="balancesAvailables" :asset="asset" :allow-zero="true" @changed="changedFee" />
            </template>

            <template slot="wizzard-footer">
                <template v-if="status">
                    <span class="d-block">Transaction is being created. It will take 1-2 minutes.</span>
                    <label class="d-block">Status: {{status}}</label>
                </template>
            </template>

        </wizzard>
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
import Wizzard from "../../utils/wizzard";

export default {
    components: {
        WaitAccount,  Account, LoadingSpinner, LoadingButton, DestinationAddress, TxAmount,
        ExtraData, AlertBox, TxFee, TxAsset, AccountIdenticon, Wizzard,
    },

    data(){
        return {
            asset: { }, //contains asset.asset and asset.validation
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
        }
    },

    props: {
        publicKey: {default: ""},
        tabsOffset: {default: 0},
        titlesOffset: {default: () => []}, //{icon, name}
        txData: {default: () => ({}) },
        buttonsOffset: {default: () => ({}) },
        txName: {default: ""},
    },

    computed:{
        address(){
            return this.$store.state.wallet.addresses[this.publicKey] ;
        },
        account(){
            return this.$store.state.accounts.list[this.publicKey]
        },
        availableAssets(){
            if (this.account && this.account.assets ) return this.account.assets;
            return null
        },
        availableAccounts(){
            return this.account && this.account.accounts ? this.account.accounts : null
        },
        balancesAvailables(){
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
            const obj = {
                ...this.buttonsOffset,
            }
            if (!obj[3+this.tabsOffset])
                obj[3+this.tabsOffset] = { icon: 'fa fa-credit-card', text: 'Sign Transaction' }

            return obj
        }
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

        async setTab({resolve, reject, oldTab, value}){

            try{

                if (value <= this.tabsOffset)
                    return this.$emit('onSetTab', {resolve, reject, oldTab, value} )

                if (oldTab === this.tabsOffset && value === this.tabsOffset+1){
                    if (this.asset.validationError) throw this.asset.validationError
                    if (this.checkDestinationError) throw this.checkDestinationError
                    if (this.destination.validationError) throw this.destination.validationError;

                    await this.$store.state.blockchain.syncPromise;
                    await this.$store.dispatch('subscribeAccount', this.destination.address.publicKey )

                    if (!this.$store.state.accounts.list[this.destination.address.publicKey] && !this.destination.address.registration )
                        throw "Destination Address doesn't have the registration. \n You have the shorter version of the address. First time when an address is used it requires the longer version."

                }
                if (oldTab === this.tabsOffset+1 && value === this.tabsOffset+2)
                    if (this.extraData.validationError) throw this.extraData.validationError

                if (oldTab === this.tabsOffset+2 && value === this.tabsOffset+3)
                    if (this.ringSize !== this.ringMembers.length) throw `Ring members are not generated well ${this.ringSize} vs ${this.ringMembers.length} `

                if (oldTab === this.tabsOffset+3 && value === this.tabsOffset+4){
                    if (this.fee.feeAuto.validationError) throw this.fee.feeAuto.validationError
                    if (this.fee.feeManual.validationError) throw this.fee.feeManual.validationError

                    await this.handleSendFunds()
                }

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
                this.error = ""

                const holders = await PandoraPay.network.getNetworkAccountsCount(this.asset.asset)

                const ringSize = this.ringSize
                let newAccounts = this.ringNewAddresses

                if (ringSize < 0 ) throw "RingSize can not be negative"
                if ( (Math.log(ringSize)/Math.log(2)) % 1 !== 0 ) throw "RingSize needs to be power of 2"
                if ( ringSize > 256 ) throw "RingSize max supported is 256"

                if ( newAccounts < 0 || newAccounts > ringSize-2) throw "New accounts needs to be in the interval [0, ringSize-2]"

                const alreadyUsedIndexes = {}

                let foundSender = false
                for (let i=0; i < this.availableAccounts.length; i++)
                    if (this.availableAccounts[i].asset === this.asset.asset){
                        alreadyUsedIndexes[this.availableAccounts[i].index] = true
                        foundSender = true
                        break
                    }

                if (!foundSender) throw "Account not found for sender"

                if (this.$store.state.accounts.list[ this.destination.address.publicKey]){
                    let availableAccounts = this.$store.state.accounts.list[ this.destination.address.publicKey]
                    for (let i=0; i < availableAccounts.length; i++)
                        if (availableAccounts.asset === this.asset.asset)
                            alreadyUsedIndexes[availableAccounts.index] = true
                }

                const count = Math.min( holders, ringSize - 2 )
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
                    asset: this.asset.asset,
                    encodeAddresses: false,
                })));

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

                for ( let i =0; ringMembers.length < ringSize - newAccounts; i++){
                    if (alreadyUsedPublicKeys[ publicKeys[i] ]) throw `Ring contains duplicate member`
                    alreadyUsedPublicKeys[ publicKeys[i] ] = true

                    const json = JSON.parse( MyTextDecode( await PandoraPay.addresses.generateAddress( MyTextEncode( JSON.stringify( {publicKey: publicKeys[i], registration: "", amount: 0, paymentId: ""} ) ) ) ) )
                    ringMembers.push( json[1] )
                }

                for (let i=0; ringMembers.length < ringSize; i++){
                    const data = JSON.parse( MyTextDecode( await PandoraPay.addresses.generateNewAddress() ) )
                    if (alreadyUsedPublicKeys[ data[2] ]) throw `Ring contains duplicate member`
                    alreadyUsedPublicKeys[ data[2] ] = true
                    ringMembers.push( data[1] )
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

            let balance
            for (const availableAccount of this.availableAccounts)
                if (availableAccount.asset === this.asset.asset){
                    balance = availableAccount.balance
                    break
                }

            const {privateKey, balanceDecoded} = await this.$store.state.page.refDecodeHomomorphicBalanceModal.showModal( this.$store.state.wallet.mainPublicKey, balance, this.asset.asset, true, password )
            if (balanceDecoded === null) throw "Decoding was canceled"

            let asset = this.asset.asset
            if (asset === PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_HEX) asset = ""

            const accs = {}
            accs[asset] = {}
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

            //compute extra
            out = await PandoraPayHelper.transactions.builder[txName]( MyTextEncode( JSON.stringify({
                ...this.txData,
                fromPrivateKeys: [privateKey],
                fromBalancesDecoded: [balanceDecoded],
                assets: [asset],
                amounts: [ Number.parseInt( await PandoraPay.config.assets.assetsConvertToUnits( this.destination.amount.toString(), this.getAsset.decimalSeparator ) ) ],
                dsts: [this.destination.addressEncoded],
                burns: [0],
                ringMembers: [this.ringMembers],
                fees: [{
                    fixed: (this.fee.feeType === 'feeAuto') ? 0 : Number.parseInt( await PandoraPay.config.assets.assetsConvertToUnits( this.fee.feeManual.amount.toString(), this.getAsset.decimalSeparator ) ),
                    perByte: 0,
                    perByteAuto: this.fee.feeType === 'feeAuto',
                }],
                data: [{
                    data: Buffer.from(this.extraData.data).toString("hex"),
                    encrypt: this.extraData.type === "encrypted",
                }],
                height: this.$store.state.blockchain.end,
                hash: this.$store.state.blockchain.hash,
                accs,
                regs,
            } ) ), (status) => {
                this.status = status
            } );

            if (!out) throw "Transaction couldn't be made";
            this.status = 'Propagating transaction...'

            const tx = JSON.parse( MyTextDecode( out[0] ) )
            const txSerialized = out[1]

            const finalAnswer = await PandoraPay.network.postNetworkMempoolBroadcastTransaction( txSerialized )
            if (!finalAnswer) throw "Transaction couldn't be broadcasted"

            await this.$store.dispatch('includeTx', { tx } )

            await this.$store.dispatch('addToast', {
                type: 'success',
                title: `Transaction created`,
                text: `A transaction has been made. \n TxId ${tx.hash}`,
            });

            this.$router.push(`/explorer/tx/${tx.hash}`);

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