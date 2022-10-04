<template>

  <layout>

    <layout-title icon="fas fa-money-check-alt" title="Resolution Pay in Future">Create a Public Transaction to make the conclusion of a pay in future.</layout-title>

    <simple-tx :public-key="publicKey" @onSetTab="setTab" account-type="none" :titles-offset="titlesOffset"
               :enable-fee="false" :enable-sender="false" :before-process-cb="beforeProcessCb" >

      <template v-slot:tab_-2>

        <div class="pb-2">
          <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Transaction Id:</label>
          <input class="form-control" type="text" v-model="txId">
        </div>

        <div class="pb-2">
          <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Payload Index:</label>
          <input class="form-control" type="text" v-model="payloadIndex" >
        </div>

      </template>

      <template v-slot:tab_-1>

        <div class="row">
          <div class="d-inline-block">
            <label class="form-label me-2">Resolution</label>
            <div class="form-check form-check-inline">
              <input class="form-check-input pointer" id="sender" type="radio" value="sender" v-model="resolution" >
              <label class="form-check-label pointer" for="sender">Sender</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input pointer"  id="receiver" type="radio" value="receiver" v-model="resolution" >
              <label class="form-check-label pointer"  for="receiver">Receiver</label>
            </div>
          </div>
        </div>

        <div class="row mt-2" v-if="payload">
          <label class="form-label mt-2">Multisig Threshold: {{payload.extra.multisigThreshold}} of {{payload.extra.multisigPublicKeys.length}} </label>
          <div v-for="(sig, i) in signatures" :key="i" class="my-4">
            <label class="form-label">Public Key: {{sig.publicKey}}</label>
            <div class="row">
              <div class="col-12">
                <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Signature</label>
                <input :class="`form-control ${validationSignatures[i] ? 'is-invalid': ''}`" type="text" v-model="sig.signature">
                <div v-if="validationSignatures[i]" class="invalid-feedback d-block">{{validationSignatures[i]}}</div>
              </div>
            </div>
          </div>
        </div>

      </template>

    </simple-tx>

  </layout>
</template>

<script>

import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title";
import SimpleTx from "src/components/send/txs/simple-tx";


export default {

    components: {SimpleTx, LayoutTitle, Layout,},

    props: {},

    data() {
        return {
            titlesOffset: {
                '-2': {
                    icon: "fas fa-dollar-sign",
                    name: "Conditional Payment",
                    tooltip: "Details regarding the Transaction Payload"
                },
                '-1': {icon: "fas fa-signature", name: "Signatures", tooltip: "Signatures required for multisig"},
            },
            txId: "",
            payloadIndex: 0,
            resolution: "sender",
            signatures: [],
            error: "",
        }
    },

    computed: {
        publicKey() {
            return this.$store.state.wallet.mainPublicKey
        },
        hash() {
            try {
                return Buffer.from(this.txId, "hex").toString("base64")
            } catch (e) {
                return ""
            }
        },
        tx() {
            return this.$store.state.transactions.txsByHash[this.hash];
        },
        txInfo() {
            if (this.tx) return this.$store.state.transactionsInfo.txsByHash[this.hash]
        },
        payload() {
            const tx = this.tx
            if (tx && tx.payloads[this.payloadIndex]) return tx.payloads[this.payloadIndex]
            return null
        },
        validationSignatures() {
            const out = []
            for (let i = 0; i < this.signatures.length; i++)
                if (this.signatures[i].signature)
                    out[i] = this.$store.getters.validateSignature(this.signatures[i].signature)
            return out
        },
    },

    methods: {
        async setTab({resolve, reject, oldTab, value}) {
            try {

                if (oldTab === -2 && value === -1) {

                    await this.loadTransaction()
                    if (!this.tx) throw "Transaction was not found"

                    if (!this.tx.version.eq(PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER))
                        throw "Wrong Transaction. It is not not a Zether tx"

                    if (!this.payload) throw "Payload was not found!"

                    if (!this.payload.payloadScript.equals(PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_PAY_IN_FUTURE))
                        throw "Payload Script is not PAY IN FUTURE"

                    if (!this.txInfo)
                        throw "Transaction is not included in Blockchain"

                    if (this.$store.state.blockchain.end.minus(this.payload.extra.deadline).gte(this.txInfo.blkHeight))
                        throw "Transaction Conclusion has expired"

                    const signatures = []
                    for (const publicKey of this.payload.extra.multisigPublicKeys)
                        signatures.push({
                            publicKey,
                            signature: null,
                        })

                    this.signatures = signatures
                }
                if (oldTab === -1 && value === 0) {
                    let counter = 0
                    for (let i = 0; i < this.signatures.length; i++)
                        if (this.signatures[i].signature !== null) {
                            const v = this.validationSignatures
                            if (v[i]) throw v[i]

                            if (this.signatures[i].signature) counter++
                        }

                    if (counter < this.payload.extra.multisigThreshold)
                        throw `You will need at least ${this.payload.extra.multisigThreshold} signatures`

                }

                resolve(true)

            } catch (err) {
                reject(err)
            }


        },

        beforeProcessCb(password, data) {

            data.txScript = PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_RESOLUTION_PAY_IN_FUTURE
            data.extra = {
                txId: this.hash,
                payloadIndex: new Decimal(this.payloadIndex),
                resolution: this.resolution === "receiver",
                multisigPublicKeys: [],
                signatures: [],
            }

            for (const sig of this.signatures)
                if (sig.signature !== null) {
                    data.extra.multisigPublicKeys.push(sig.publicKey)
                    data.extra.signatures.push(sig.signature)
                }

        },

        async loadTransaction() {

            try {
                this.loaded = false;
                this.error = ""

                if (!this.hash) throw 'Tx hash was not specified';

                await this.$store.state.blockchain.syncPromise;

                if (this.tx && this.tx.hash === this.hash) return

                if (this.tx) await this.removed()

                const tx = await this.$store.dispatch('getTransactionByHash', this.hash);

                if (tx) {
                    this.$store.commit('updateViewTransactionsHashes', {txsHashes: [tx.hash], insert: true})
                    await this.$store.dispatch('subscribeTransaction', {txId: tx.hash})
                }

            } catch (err) {
                this.error = err.toString()
            } finally {
                this.loaded = true
            }

        },

        async removed(tx = this.tx) {
            this.$store.commit('updateViewTransactionsHashes', {txsHashes: [tx.hash], insert: false})
            await this.$store.dispatch('unsubscribeTransaction', tx.hash)
        },

        async updateRouteParams(to = this.$route){
            try{

                if (to.query.txId !== undefined) {
                    if (to.query.txId.length !== 2 * PandoraPay.cryptography.HASH_SIZE) throw "Tx Id is invalid"
                    this.txId = to.query.txId
                }
                else this.txId = ""

                if (to.query.payloadIndex !== undefined) this.payloadIndex = to.query.payloadIndex
                else this.payloadIndex = ""

                await this.loadTransaction()

            }catch(e){
                this.$store.dispatch('addToast', {
                    type: 'error',
                    title: `There was an error processing URL query`,
                    text: `Raised an error ${e.message}`,
                })
            }
        },

    },

    watch: {
        $route: {
            immediate: true,
            handler: function (to, from) {
                this.updateRouteParams(to)
            }
        }
    }

}

</script>

<style scoped>
</style>
