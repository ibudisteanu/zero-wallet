<template>
    <wait-account :account="account" type="zether">

        <wizard :titles="{
            0: {icon: 'fas fa-user', name: 'Recipient', tooltip: 'Recipient of the private tx' },
            1: {icon: 'fas fa-eye-slash', name: 'Privacy', tooltip: 'Setting the ring members of the transaction' },
            2: {icon: 'fas fa-pencil-alt', name: 'Info', tooltip: 'Extra information attached in the tx' },
            3: {icon: 'fas fa-search-dollar', name: 'Preview', tooltip: 'Preview the transaction before Propagating' },
            ...titlesOffset }"
                @onSetTab="setTab" controls-class-name="card-footer bg-light" :buttons="buttons" class="card" ref="refWizard">

            <template v-for="(_, index) in titlesOffset" v-slot:[getTabSlotName(index)]>
                <slot :name="`tab_${index}`"></slot>
            </template>

            <template v-slot:tab_0 v-if="payloads">

                <div v-for="(payload, i) in payloads" :key="`payload-recipient-${i}`">

                    <h5 class="pe-3 pb-1">PAYLOAD {{ i + 1 }}</h5>
                    <div class="form-check" v-if="payload.allowRandomRecipient">
                        <input class="form-check-input" :id="`random-recipient-${i}`" type="checkbox" name="checkbox" v-model="payload.randomRecipient">
                        <label class="form-check-label" :for="`random-recipient-${i}`">Random Recipient with Zero amount</label>
                    </div>
                    <template v-if="!payload.randomRecipient">
                        <tx-recipient :text="text" :init-recipient="initRecipients[i]" :init-amount="initAmounts[i]" :init-asset="initAssets[i]"
                                      :available-assets="availableAssets"
                                      :validate-amount="payload.validateRecipientAmount" :balances="availableBalances"
                                      :allow-zero="payload.allowRecipientZeroAmount"
                                      @changed="data =>changedRecipient(i, data)"/>
                    </template>

                    <hr class="my-4"/>

                </div>

                <button class="btn btn-falcon-default rounded-pill me-1  pointer" type="button" @click="handleAddPayload">
                    <i class="fa fa-plus"/>
                    Add another recipient
                </button>

                <button class="btn btn-falcon-default rounded-pill me-1 text-danger pointer" type="button"
                        @click="handleRemovePayload" :disabled="payloads.length <= payloadsCount">
                    <i class="fa fa-times"/>
                    Remove last recipient
                </button>

            </template>

            <template v-slot:tab_1>

                <div class="row" v-for="(payload, i) in payloads" :key="`payload-ring-${i}`">

                    <h5 class="pe-3 pb-1">PAYLOAD {{ i + 1 }}</h5>
                    <div class="col-12 col-md-6">
                        <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Ring Size</label>
                        <i class="fas fa-question ms-1" v-tooltip.bottom="`Bigger the ring, more private is your transaction.`"/>
                        <select class="form-select" v-model.number="payload.ringSize">
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
                        <i class="fas fa-question ms-1" v-tooltip.bottom="`Number of new addresses in the ring. Makes fresh new recipients more private.`"/>
                        <input class="form-control" type="number" v-model.number="payload.ringNewAddresses"/>
                    </div>

                    <div v-if="validationRingSizes[i]" class="invalid-feedback d-block">{{validationRingSizes[i]}}</div>

                    <div class="col-12 pt-4">
                        <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Sender Ring Members</label>
                        <i class="fas fa-question ms-1" v-tooltip.bottom="`Preview of the Sender Ring Members used in your private payload ${i}.`"/>
                        <div class="pt-2">
                            <div v-for="(ringMember, index) in payload.senderRingMembers" class="d-inline-block"
                                 :key="`payload-${i}-sender-ring-member-${index}`">
                                <account-identicon :address="ringMember" size="21" outer-size="7"
                                                   :disable-route="true"/>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 pt-1">
                        <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Recipient Ring Members</label>
                        <i class="fas fa-question ms-1" v-tooltip.bottom="`Preview of the Recipient Ring Members used in your private payload ${i}.`"/>
                        <div class="pt-2">
                            <div v-for="(ringMember, index) in payload.recipientRingMembers" class="d-inline-block"
                                 :key="`payload-${i}-recipient-ring-member-${index}`">
                                <account-identicon :address="ringMember" size="21" outer-size="7"
                                                   :disable-route="true"/>
                            </div>
                        </div>
                    </div>

                    <hr class="my-4" v-if="payloads.length !== i+1"/>

                </div>

                <div class="col-12 pt-4">
                    <loading-button text="Generate Ring" @submit="resolve => handleGenerateRing(resolve)" icon="fas fa-cogs"/>
                </div>

            </template>

            <template v-slot:tab_2>

                <div class="row" v-for="(payload, i) in payloads" :key="`payload-extra-${i}`">

                    <h5 class="pe-3 pb-1">PAYLOAD {{ i + 1 }}</h5>

                    <extra-data :recipients="payload.recipient ? [payload.recipient] : null"
                                :paymentID="(payload.recipient && payload.recipient.address) ? payload.recipient.address.paymentID : null"
                                :init-data="initExtraData[i]" :init-data-encryption="initExtraDataEncryption[i]"
                                @changed="data => changedExtraData(i, data)"/>

                    <tx-fee :balances="availableBalances" :asset="payload.recipient.asset" :allow-zero="true"
                            @changed="data => changedFee(i, data)"/>

                    <template v-if="payload.recipient.asset !== PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64">
                        <div class="form-check pt-2">
                            <input class="form-check-input" id="assetFeeLiquidityAsset" type="checkbox" v-model="payload.assetFeeLiquidityAsset"/>
                            <label class="form-check-label" for="assetFeeLiquidityAsset">Automatically Determine Asset Fee Liquidity</label>
                        </div>
                        <div class="row" v-if="!payload.assetFeeLiquidityAsset">
                            <div class="col-12 col-sm-6">
                                <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Conversion
                                    Rate</label>
                                <i class="fas fa-question ms-1" v-tooltip.bottom="`Conversion rate of the asset fee`"/>
                                <input
                                    :class="`form-control ${payload.validationAssetFeeConversionRate ? 'is-invalid' :''}`"
                                    type="number" v-model.number="payload.assetFeeConversionRate" min="0"
                                    :step="0.0000000001">
                            </div>
                        </div>
                    </template>

                    <hr class="my-4" v-if="payloads.length !== i+1"/>
                </div>

            </template>

            <template v-slot:tab_3>
                <confirm-broadcasting-tx v-if="tx" class="my-3 fs--1" :tx="tx"/>
            </template>

            <template #wizard-footer>
                <alert-box v-if="error" class="w-100" type="error" :dismissible-timeout="10000" :dismissible-text="error" @onDismissible="error=''">
                    {{ error }}
                </alert-box>

                <alert-box v-if="status && statusType === 'signing'" class="w-100" type="info">
                    <h4 class="alert-heading fw-semi-bold">Signing Tx...</h4>
                    <p>Transaction is being created. It will take 1-2 minutes for each payload.</p>
                    <hr>
                    <p class="mb-0">Status: {{ status }}</p>
                </alert-box>

                <alert-box v-if="status && statusType === 'broadcasting'" class="w-100" type="info">
                    <h4 class="alert-heading fw-semi-bold">Broadcasting Tx...</h4>
                    <p>Your Tx is being broadcasting. It should take 20 seconds max.</p>
                    <hr>
                    <p class="mb-0">Status: {{ status }}</p>
                </alert-box>

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

export default {

    components: {
        WaitAccount, Account, LoadingSpinner, LoadingButton, TxRecipient, TxAmount,
        ExtraData, AlertBox, TxFee, TxAsset, AccountIdenticon, Wizard, ConfirmBroadcastingTx,
    },

    props: {
        publicKey: {default: ""},
        titlesOffset: {default: () => ({})}, //{icon, name}
        buttonsOffset: {default: () => ({})},
        text: {default: "Recipient"},
        payloadsCount: {default: 1},
        initAvailableBalance: {default: null},
        beforeProcessCb: {default: null},
        buildPayloadCb: {default: null},

        initRecipients: { default: () => [] },
        initAssets: { default: () => [] },
        initAmounts: { default: () => [] },
        initExtraData: {default: () => []},
        initExtraDataEncryption: {default: () => []},
    },


    data() {

        const payloadsArray = [...Array(this.payloadsCount)]

        const getRingSize = () => {
            const probability2 = Math.random()
            if (probability2 < 0.4) return 32
            if (probability2 < 0.6) return 64
            if (probability2 < 0.8) return 128
            return 256
        }

        const ringNewAddresses = () => {
            const probability = Math.random()
            if (probability < 0.8) return 0
            if (probability < 0.9) return 1
            return 2
        }


        const ringSizeInit = getRingSize()
        const ringNewAddressesInit = ringNewAddresses()

        return {

            payloads: payloadsArray.map((it, i) => this.createNewPayload(i, ringSizeInit, ringNewAddressesInit)),
            subscribedAccounts: {},

            tx: null,
            txSerialized: null,

            ringSizeInit,
            ringNewAddressesInit,

            status: '',
            error: '',
            statusType: ""
        }
    },

    computed: {

        walletAddress() {
            return this.$store.state.wallet.addresses[this.publicKey];
        },
        account() {
            return this.$store.state.accounts.list[this.publicKey]
        },

        availableAccounts() {
            return this.account && this.account.accounts ? this.account.accounts : null
        },

        availableAssets() {
            return this.availableAccounts ? this.availableAccounts.map(it => it.asset) : null
        },

        availableBalances() {
            if (this.initAvailableBalance) return this.initAvailableBalance

            const available = this.availableAccounts || []

            const final = {}
            for (const acc of available)
                final[acc.asset] = acc

            return final
        },

        validationAssetFeeConversionRate() {
            try {

            } catch (err) {
                return err.toString()
            }
        },

        getAsset() {
            return this.$store.getters.getAsset(this.asset ? this.recipient.asset : null);
        },

        buttons() {
            return {
                2: {icon: 'fas fa-file-signature', text: 'Sign Transaction'},
                3: {icon: 'fas fa-globe-americas', text: 'Propagate Transaction'},
                ...this.buttonsOffset,
            }
        },

        validationRingSizes(){
            const o = []

            for (let i=0; i < this.payloads.length; i++){

                const payload = this.payloads[i]
                try{

                    for (let j=0; j < i; j++){

                        if (!this.payloads[i].createNewSender && !this.payloads[j].createNewSender && this.payloads[i].ringSize !== this.payloads[j].ringSize )
                            throw `The payloads ${i+1} and ${j+1} should have same sizes to avoid leaking the sender`

                        if (!this.payloads[i].randomRecipient && !this.payloads[j].randomRecipient && this.payloads[i].recipient.address.publicKey === this.payloads[j].recipient.address.publicKey)
                            if (this.payloads[i].ringSize !== this.payloads[j].ringSize || this.payloads[i].ringNewAddresses !== this.payloads[j].ringNewAddresses)
                                throw `The payloads ${i+1} and ${j+1} should have same configuration to avoid leaking the receiver`
                    }

                    if (payload.senderRingMembers.length && payload.ringSize / 2 !== payload.senderRingMembers.length) throw `Ring Sender members are not generated well ${payload.ringSize / 2} vs ${payload.senderRingMembers.length} `
                    if (payload.recipientRingMembers.length && payload.ringSize / 2 !== payload.recipientRingMembers.length) throw `Ring Recipient members are not generated well ${payload.ringSize / 2} vs ${payload.recipientRingMembers.length} `

                    o[i] = ""
                }catch(e){
                    o[i] = e.toString()
                }

            }
            return o
        },

    },

    watch: {

        async payloads(to, from) {
            if (to === from) return

            await this.$store.state.blockchain.syncPromise;

            const subscribedAccounts = {}

            for (const payload in to) {
                if (payload.recipient && payload.recipient.address && payload.recipient.address.publicKey && !this.$store.getters.walletContains(payload.recipient.address.publicKey)) {
                    subscribedAccounts[payload.recipient.address.publicKey] = true
                    await this.$store.dispatch('subscribeAccount', {publicKey: payload.recipient.address.publicKey})
                }
            }

            const deleteList = []
            for (const subscribed in this.subscribedAccounts)
                if (!subscribedAccounts[subscribed] && !this.$store.getters.walletContains(subscribed)) {
                    await this.$store.dispatch('unsubscribeAccount', subscribed)
                    deleteList.push(subscribed)
                }

            for (const subscribed of deleteList)
                delete (this.subscribedAccounts[subscribed])
        },
    },

    methods: {

        createNewPayload(index, ringSize = this.ringSizeInit, ringNewAddresses = this.ringNewAddressesInit) {

            const data = {
                createNewSender: null,

                allowRandomRecipient: false,
                randomRecipient: false,

                allowRecipientZeroAmount: true,
                validateRecipientAmount: true,

                recipient: {
                    address: null,
                    addressEncoded: "",
                    addressValidationError: "",
                    amount: new Decimal(0),
                    amountValidationError: "",
                    asset: null,
                    assetValidationError: "",
                },

                fee: {},
                assetFeeLiquidityAsset: true,
                assetFeeConversionRate: 1,

                extraData: {
                    data: "",
                    type: "public",
                    publicKeyToEncrypt: "",
                    validationError: null,
                },

                ringSize: ringSize,
                ringNewAddresses: ringNewAddresses,

                senderRingMembers: [],
                recipientRingMembers: [],
                payloadScript:PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_TRANSFER,

            }

            if (this.buildPayloadCb)
                this.buildPayloadCb(index, data)

            return data
        },

        getTabSlotName(index) {
            return `tab_${index}`
        },

        async setTab({resolve, reject, oldTab, value}) {

            try {

                this.status = ""

                if (oldTab === 0 && value > oldTab) {

                    for (let i=0; i < this.payloads.length; i++) {

                        const payload = this.payloads[i]
                        if (!payload.randomRecipient) {

                            if (payload.recipient.addressValidationError) throw payload.recipient.addressValidationError;
                            if (payload.recipient.amountValidationError) throw payload.recipient.amountValidationError;
                            if (payload.recipient.assetValidationError) throw payload.recipient.assetValidationError;

                            if (payload.recipient.address)
                                if (payload.recipient.address.publicKey === this.walletAddress.publicKey) throw `Recipient ${payload.recipient.addressEncoded} can not be the same with sender`;

                            for (let j=0; j < i; j++)
                                if (payload.recipient.address.publicKey === this.payloads[j].recipient.address.publicKey )
                                    throw `Duplicate recipients detected. You should not use the same recipient twice in a transaction.`

                            await this.$store.state.blockchain.syncPromise;
                            await this.$store.dispatch('subscribeAccount', {publicKey: payload.recipient.address.publicKey})

                            if (!this.$store.state.accounts.list[payload.recipient.address.publicKey] && !payload.recipient.address.registration)
                                throw `Recipient Address ${payload.recipient.addressEncoded} doesn't have the registration. \n You have the shorter version of the address. First time when an address is used it requires the longer version.`
                        }

                    }

                } else if (oldTab === 1 && value > oldTab) {

                    if ( !this.payloads[0].senderRingMembers.length || !this.payloads[0].recipientRingMembers.length )
                        await this.handleGenerateRing()

                    const o = this.validationRingSizes
                    for (let i=0; i < this.payloads.length; i++)
                        if (o[i]) throw o[i]

                } else if (oldTab === 2 && value > oldTab) {

                    for (let i = 0; i < this.payloads.length; i++) {
                        if (this.payloads[i].extraData.validationError) throw this.payloads[i].extraData.validationError
                        if (this.payloads[i].fee.feeAuto.validationError) throw this.payloads[i].fee.feeAuto.validationError
                        if (this.payloads[i].fee.feeManual.validationError) throw this.payloads[i].fee.feeManual.validationError
                    }

                    await this.handleSendFunds()

                } else if (oldTab === 3 && value > oldTab) {
                    try {
                        await this.handlePropagateTx()
                    } catch (e) {
                        this.$refs.refWizard.setTab(resolve, 2)
                        reject(e)
                    }
                } else return this.$emit('onSetTab', {resolve, reject, oldTab, value})

                resolve(true)
            } catch (err) {
                console.error(err)
                reject(err)
            }
        },

        changedRecipient(i, data) {
            this.payloads[i].recipient = {...this.payloads[i].recipient, ...data,}
        },
        changedFee(i, data) {
            this.payloads[i].fee = {...this.payloads[i].fee, ...data,}
        },
        changedExtraData(i, data) {
            this.payloads[i].extraData = {...this.payloads[i].extraData, ...data,}
        },

        handleAddPayload() {
            this.payloads.push(
                this.createNewPayload(this.payloads.length)
            )
        },

        handleRemovePayload() {
            this.payloads.splice(this.payloads.length - 1, 1)
        },

        async handleGenerateRing(resolver) {

            try {

                const senderRings = {}, recipientRings = {}
                const allAlreadyUsed = {} //avoid having same decoy twice

                for (let payloadIndex = 0; payloadIndex < this.payloads.length; payloadIndex++) {

                    const canStake = function () {
                        return Math.random() < 0.1 && payload.payloadScript !== PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_CONDITIONAL_PAYMENT;
                    }

                    let senderRingMembers = [], recipientRingMembers = []

                    const payload = this.payloads[payloadIndex]
                    const asset = payload.recipient.asset

                    let assetCollector
                    if (asset !== PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64) {
                        const outData = await PandoraPay.network.getNetworkFeeLiquidity(0, asset)
                        if (!outData) throw "No Asset Fee Liqiduity for asset"
                        const out = JSONParse(MyTextDecode(outData))
                        assetCollector = out.collector
                    }

                    const holdersData = await PandoraPay.network.getNetworkAccountsCount(asset)
                    const holders = JSONParse(MyTextDecode(holdersData)).count

                    const ringSize = payload.ringSize
                    let newAccounts = payload.ringNewAddresses

                    if (ringSize < 0) throw "RingSize can not be negative"
                    if ((Math.log(ringSize) / Math.log(2)) % 1 !== 0) throw "RingSize needs to be power of 2"
                    if (ringSize > 256) throw "RingSize max supported is 256"

                    if (newAccounts < 0 || newAccounts > ringSize - 2) throw "New accounts needs to be in the interval [0, ringSize-2]"


                    if (!payload.createNewSender) {

                        if (!this.availableAccounts || !this.availableAccounts.length) throw "You don't have any available private funds"

                        let foundSenderIndex
                        for (const availableAccount of this.availableAccounts)
                            if (availableAccount.asset === asset) {
                                foundSenderIndex = availableAccount.index
                                break
                            }

                        if (foundSenderIndex === undefined) throw "Account not found for sender"

                        if (senderRings[this.walletAddress.publicKey])
                            senderRingMembers = senderRings[this.walletAddress.publicKey]
                        else {
                            senderRingMembers.push(this.walletAddress.addressEncoded)
                            senderRings[this.walletAddress.publicKey] = senderRingMembers
                            allAlreadyUsed[this.walletAddress.publicKey] = true
                        }
                    }else {
                        
                        const json = JSONParse(MyTextDecode(await PandoraPay.addresses.generateNewAddress(MyTextEncode(JSONStringify({
                            registration: true,
                            staked: canStake()
                        })))))

                        payload.newSender = {privateKey: json[0], addressEncoded: json[1], publicKey: json[2]}
                        senderRingMembers.push(payload.newSender.addressEncoded)

                        senderRings[payload.newSender.publicKey] = senderRingMembers
                        allAlreadyUsed[payload.newSender.publicKey] = true
                    }


                    if (!payload.randomRecipient) {
                        if (recipientRings[payload.recipient.address.publicKey])
                            recipientRingMembers = recipientRings[payload.recipient.address.publicKey]
                        else {
                            recipientRingMembers.push(payload.recipient.addressEncoded)
                            recipientRings[payload.recipient.address.publicKey] = recipientRingMembers
                        }
                        allAlreadyUsed[payload.recipient.address.publicKey] = true
                    }

                    let step = -1
                    while (senderRingMembers.length < ringSize / 2 || recipientRingMembers.length < ringSize / 2) {

                        step++

                        async function getRandomAccounts(ringMembers, tempSelected) {

                            if (holders.gt(2)) {
                                const count = Decimal.min(holders, ringSize / 2).minus(ringMembers.length)
                                for (let i = new Decimal(0); i.lt(count); i = i.plus(1)) {

                                    let trials = 0

                                    let index = await PandoraPay.helpers.randomUint64N(holders.toString())
                                    while (trials < 100 && ( tempSelected[index] ) ) {
                                        index = await PandoraPay.helpers.randomUint64N(holders.toString())
                                        trials++
                                    }

                                    if (trials >= 100) break
                                    tempSelected[index] = true
                                }
                            }

                        }

                        async function getRandomPublicKey(ringAdd) {

                            let publicKeysList = Object.keys(ringAdd)
                            if (!publicKeysList.length) return {result: false}

                            let index = Math.floor(Math.random() * publicKeysList.length)
                            const publicKeySelected = publicKeysList[index]
                            delete ringAdd[publicKeySelected]

                            if (allAlreadyUsed[publicKeySelected])
                                return {result: true, addr: null }


                            const json = JSONParse(MyTextDecode(await PandoraPay.addresses.createAddress(MyTextEncode(JSONStringify({
                                publicKey: publicKeySelected,
                                registration: "",
                                paymentID: "",
                                paymentAmount: 0,
                                paymentAsset: ""
                            })))))

                            allAlreadyUsed[publicKeySelected] = true
                            return {result: true, addr: {addressEncoded: json[1], publicKey: publicKeySelected} }

                        }

                        let trial = 0, senderAdd, recipientAdd

                        while (trial < 10) {

                            const senderTempSelected = {}, recipientTempSelected = {}
                            senderAdd = {}, recipientAdd = {}

                            await getRandomAccounts(senderRingMembers, senderTempSelected)
                            await getRandomAccounts(recipientRingMembers, recipientTempSelected)

                            const tempSelectedArray = Object.keys(senderTempSelected).concat(Object.keys(recipientTempSelected)).map(it => new Decimal(it))
                            tempSelectedArray.sort((a, b) => a.minus(b))

                            let outData = await PandoraPay.network.getNetworkAccountsKeysByIndex(MyTextEncode(JSONStringify({
                                indexes: tempSelectedArray,
                                asset: asset,
                                encodeAddresses: false,
                            })));

                            const publicKeys = JSONParse(MyTextDecode(outData)).publicKeys

                            outData = await PandoraPay.network.getNetworkAccountsByKeys(MyTextEncode(JSONStringify({
                                keys: publicKeys.map(it => ({publicKey: it})),
                                asset,
                                includeMempool: true,
                            })))

                            const accountsData = JSONParse(MyTextDecode(outData))

                            for (let i = 0; i < publicKeys.length; i++) {

                                if (publicKeys[i] === assetCollector) continue

                                const index = tempSelectedArray[i]
                                if (payload.payloadScript === PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_CONDITIONAL_PAYMENT && accountsData.registration[i].staked) continue

                                if (recipientTempSelected[index]) { //receiver
                                    recipientAdd[publicKeys[i]] = {index}
                                } else { //sender
                                    if ((!accountsData.registration[i] || !accountsData.registration[i].spendPublicKey)) //making sure it doesn't have a spendPublicKey
                                        senderAdd[publicKeys[i]] = {index}
                                }
                            }

                            if (Object.keys(senderAdd).length !== 0 && Object.keys(recipientAdd).length !== 0)
                                break

                            trial++
                        }

                        if (step === 0){

                            if (payload.randomRecipient){
                                while (1) {
                                    const out = await getRandomPublicKey(recipientAdd)
                                    if (!out.result) throw "Error Generating Random Recipient. Try again"
                                    if (out.addr == null) continue

                                    payload.recipient = {
                                        addressEncoded: out.addr.addressEncoded,
                                        address: { publicKey: out.addr.publicKey },
                                        addressValidationError:"",
                                        amount: new Decimal(0),
                                        amountValidationError: "",
                                        asset,
                                        assetValidationError: "",
                                    }
                                    if (recipientRings[payload.recipient.address.publicKey])
                                        recipientRingMembers = recipientRings[payload.recipient.address.publicKey]
                                    else
                                        recipientRingMembers.push(payload.recipient.addressEncoded)
                                    break
                                }
                            }

                            if (holders.lt(ringSize))
                                newAccounts = ringSize

                            for (let i=0; i < newAccounts && recipientRingMembers.length < ringSize/2; i++){

                                const json = JSONParse( MyTextDecode( await PandoraPay.addresses.generateNewAddress( MyTextEncode( JSONStringify( { registration: true, staked: canStake() } ) ) ) ) )
                                recipientRingMembers.push( json[1] )
                            }

                        }

                        for (let i = 0; senderRingMembers.length < ringSize / 2; i++) {
                            const out = await getRandomPublicKey(senderAdd)
                            if (!out.result) break
                            if (out.addr) senderRingMembers.push(out.addr.addressEncoded)
                        }

                        for (let i = 0; recipientRingMembers.length < ringSize / 2; i++) {
                            const out = await getRandomPublicKey(recipientAdd)
                            if (!out.result) break
                            if (out.addr) recipientRingMembers.push(out.addr.addressEncoded)
                        }

                    }

                    payload.senderRingMembers = senderRingMembers
                    payload.recipientRingMembers = recipientRingMembers

                }

            } catch (err) {
                this.error = err.toString()
            } finally {
                if (resolver) resolver()
            }

        },

        async handleSendFunds() {

            try {
                this.statusType = "signing"
                this.status = '';

                const accs = {}
                const regs = {}

                const txData = {
                    payloads: [],
                    accs,
                    regs,
                }

                const password = await this.$store.state.page.refWalletPasswordModal.showModal()
                if (password === null) return

                let decryptedWalletBalance

                for (const payload of this.payloads) {

                    const asset = payload.recipient.asset
                    if (!accs[asset]) accs[asset] = {}

                    let senderPrivateKey, senderDecryptedBalance, senderSpendPrivateKey
                    if (!payload.createNewSender) {

                        let balance
                        for (const availableAccount of this.availableAccounts)
                            if (availableAccount.asset === asset) {
                                balance = availableAccount.balance
                                break
                            }

                        if (!decryptedWalletBalance) {
                            decryptedWalletBalance = await this.$store.state.page.refDecryptBalanceModal.showModal(this.$store.state.wallet.mainPublicKey, balance, asset, true, password)
                            if (decryptedWalletBalance.decryptedBalance === null) throw "Decrypting was canceled"
                        }

                        senderPrivateKey = decryptedWalletBalance.privateKey
                        senderSpendPrivateKey = decryptedWalletBalance.spendPrivateKey
                        senderDecryptedBalance = decryptedWalletBalance.decryptedBalance
                    } else {
                        senderPrivateKey = payload.newSender.privateKey
                        senderSpendPrivateKey = null
                        senderDecryptedBalance = this.availableBalances[asset].amount
                    }

                    const list = [...payload.senderRingMembers, ...payload.recipientRingMembers]

                    const shuffle = JSONParse(MyTextDecode(await PandoraPay.helpers.shuffleArray_for_Zether(list.length.toString())))
                    const ringShuffle = shuffle.map(it => list[it])

                    const ringShufflePublicKeys = await Promise.all(ringShuffle.map(async it => JSONParse(MyTextDecode(await PandoraPay.addresses.decodeAddress(it))).publicKey))

                    let outData = await PandoraPay.network.getNetworkAccountsByKeys(MyTextEncode(JSONStringify({
                        keys: ringShufflePublicKeys.map(it => ({publicKey: it})),
                        asset,
                        includeMempool: true,
                    })))

                    let out = JSONParse(MyTextDecode(outData))
                    for (let i = 0; i < out.accountSerialized.length; i++) {
                        accs[asset][ringShufflePublicKeys[i]] = out.accountSerialized[i]
                        regs[ringShufflePublicKeys[i]] = out.registrationSerialized[i]
                    }

                    const amount = payload.recipient.amount
                    const fee = payload.fee.feeType ? 0 : payload.fee.feeManual.amount

                    let feeRate = new Decimal(0), feeLeadingZeros = new Decimal(0)

                    if (asset !== PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64)
                        if (payload.assetFeeLiquidityAsset) {
                            outData = await PandoraPay.network.getNetworkFeeLiquidity(0, asset)
                            if (!outData) throw "No Asset Fee Liqiduity for asset"
                            out = JSONParse(MyTextDecode(outData))

                            feeRate = out.rate
                            feeLeadingZeros = out.leadingZeros
                        } else {

                            const parts = payload.assetFeeConversionRate.toString().split(".")
                            if (parts.length > 1)
                                feeLeadingZeros = parts[1].length

                            feeRate = new Decimal(payload.assetFeeConversionRate).mul(new Decimal(10).pow(feeLeadingZeros))
                        }

                    txData.payloads.push({
                        sender: {
                            privateKey: senderPrivateKey,
                            spendPrivateKey: senderSpendPrivateKey,
                            decryptedBalance: senderDecryptedBalance,
                        },
                        asset,
                        amount,
                        recipient: payload.recipient.addressEncoded,
                        burn: new Decimal(0),
                        senderRingMembers: payload.senderRingMembers,
                        recipientRingMembers: payload.recipientRingMembers,
                        fees: {
                            fixed: fee,
                            perByte: new Decimal(0),
                            perByteExtraSpace: new Decimal(0),
                            perByteAuto: payload.fee.feeType,
                            rate: feeRate,
                            leadingZeros: feeLeadingZeros,
                        },
                        data: {
                            data: (payload.recipient.address && payload.recipient.address.paymentID) ? payload.extraData.data : Buffer.from(payload.extraData.data).toString("base64"),
                            encrypt: payload.extraData.type === "encrypted",
                        },
                        extra: null,
                        payloadScript: payload.payloadScript,
                    })

                }

                if (this.beforeProcessCb)
                    await this.beforeProcessCb(password, txData)

                await PandoraPayHelperPromise

                txData.chainKernelHeight = this.$store.state.blockchain.end - 1
                txData.chainKernelHash = this.$store.state.blockchain.kernelHash

                //compute extra
                const out = await PandoraPayHelper.transactions.builder.createZetherTx(
                    MyTextEncode(JSONStringify(txData)),
                    status => {
                        this.status = status
                    }
                );

                if (!out) throw "Transaction couldn't be made";

                this.tx = JSONParse(MyTextDecode(out[0]))
                const serialized = out[1]

                this.tx._serialized = serialized.toString("base64")
                this.txSerialized = serialized

                this.status = "Tx built"

            } finally {
                this.status = ""
            }

        },

        async handlePropagateTx() {

            try {
                this.statusType = "broadcasting"

                this.status = 'Cloning transaction...'
                const txSerialized = Buffer.alloc(this.txSerialized.length)
                Buffer.from(this.txSerialized).copy(txSerialized, 0)

                this.status = 'Broadcasting your transaction in the network... Please wait...'

                await this.$store.dispatch('includeTx', {tx: this.tx, serialized: this.tx._serialized, mempool: false})

                const finalAnswer = await PandoraPay.network.postNetworkMempoolBroadcastTransaction(txSerialized)
                if (!finalAnswer) {
                    this.$store.commit('deleteTransactions', [this.tx])
                    throw "Transaction couldn't be broadcast"
                }

                this.$router.push(`/explorer/tx/${Buffer.from(this.tx.hash, "base64").toString("hex")}`);

                this.$emit('onBroadcast', {tx: this.tx})
            } finally {
                this.status = ""
            }

        },


    },

    beforeUnmount() {
        this.payloads = []
    }

}
</script>
