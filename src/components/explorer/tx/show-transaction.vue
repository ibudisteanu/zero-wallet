<template>
  <div>

    <div :class="`${confirmation ? '': 'card mb-3'}`">
      <div class="card-header bg-light">
        <div class="row align-items-center">
          <div class="col">
            <h5 class="mb-0 text-truncate">Tx {{ $strings.base64ToHex(tx.hash) }}</h5>
          </div>
        </div>
      </div>
      <div class="card-body p-3 fs--1">

        <div class="row pb-2">
          <span class="col-4 col-sm-3 text-truncate">Hash</span>
          <div class="col-8 col-sm-9 text-truncate">
            <router-link :to="`/explorer/tx/${$strings.base64ToHex(tx.hash)}`">
              {{ $strings.base64ToHex(tx.hash) }}
            </router-link>
          </div>
        </div>

        <template v-if="!confirmation">
          <div class="row pb-2 bg-light">
            <span class="col-4 col-sm-3 text-truncate">Tx Height</span>
            <div class="col-8 col-sm-9 text-truncate">
              <span v-if="txInfo && txInfo.height">
                <router-link :to="`/explorer/tx/${txInfo.height}`">{{ txInfo.height }}</router-link>
              </span>
              <span v-else>-</span>
            </div>
          </div>
          <div class="row pt-2 pb-2">
            <span class="col-4 col-sm-3 text-truncate">Block Height</span>
            <div class="col-8 col-sm-9 text-truncate">
              <span v-if="txInfo && txInfo.blkHeight ">
                <router-link :to="`/explorer/block/${txInfo.blkHeight}`">{{ txInfo.blkHeight }}</router-link>
              </span>
              <span v-else>-</span>
            </div>
          </div>
          <div class="row pt-2 pb-2 bg-light">
            <span class="col-4 col-sm-3 text-truncate">Block Timestamp</span>
            <div class="col-8 col-sm-9 text-truncate">
              <span v-if="txInfo && txInfo.timestamp" v-tooltip.bottom="`${ $strings.formatTime( $store.state.blockchain.genesisTimestamp.plus( txInfo.timestamp ).times(1000).toNumber() ) }`">
                ~ {{ $strings.timeSince($store.state.blockchain.genesisTimestamp.plus(txInfo.timestamp).times(1000), false)  }} ago
              </span>
              <span v-else>-</span>
            </div>
          </div>
          <div class="row pt-2 pb-2">
            <span class="col-4 col-sm-3 text-truncate">Confirmations</span>
            <div class="col-8 col-sm-9 text-truncate">
              <span v-if="txInfo && txInfo.blkHeight">
                {{ $store.state.blockchain.end.minus(txInfo.blkHeight) }}
                <i v-if="$store.state.blockchain.end.minus( txInfo.blkHeight ).gt(8)" class="fas fa-check"></i>
              </span>
              <span v-else>-</span>
            </div>
          </div>
          <div class="row pt-2 pb-2 bg-light">
            <span class="col-4 col-sm-3 text-truncate">Pending Tx</span>
            <span class="col-8 col-sm-9 text-truncate">{{ txInfo.mempool ? 'YES' : ' No' }}</span>
          </div>

        </template>

        <div class="row pt-2 pb-2">
          <span class="col-4 col-sm-3 text-truncate">Size</span>
          <div class="col-8 col-sm-9 text-truncate">
            <span v-tooltip.bottom="`${ $strings.formatBytes(tx.size.toNumber()) }`"> {{ $strings.formatSize(tx.size.toNumber()) }} </span>
          </div>
        </div>

        <div class="row pt-2 pb-2 bg-light" v-if="$store.state.settings.expert">
          <span class="col-4 col-sm-3 text-truncate">Space Extra Size</span>
          <div class="col-8 col-sm-9 text-truncate">
            <span v-tooltip.bottom="`${ $strings.formatBytes(tx.spaceExtra.toNumber()) }`"> {{ $strings.formatSize(tx.spaceExtra.toNumber()) }} </span>
          </div>
        </div>

        <div class="row pt-2 pb-2" v-if="$store.state.settings.expert">
          <span class="col-4 col-sm-3 text-truncate">Version</span>
          <span class="col-8 col-sm-9 text-truncate">
            {{ tx.version }}
            <span :class="`badge badge-soft-${$store.getters.getTxVersionBadgeColor(tx.version)}`" v-tooltip.bottom="$store.getters.getTxVersionText(tx.version)">
              {{ $store.getters.getTxVersionText(tx.version) }}
            </span>
          </span>
        </div>

      </div>
    </div>

    <template v-if="tx.version.eq(PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE)">

      <div :class="`${confirmation ? '': 'card mb-3'}`">
        <div class="card-header bg-light">
          <div class="row align-items-center">
            <div class="col">
              <h5 class="mb-0 text-truncate">Tx Simple</h5>
            </div>
          </div>
        </div>
        <div class="card-body p-3 fs--1">

          <div class="row pt-2 pb-2  bg-light">
            <span class="col-4 col-sm-3 text-truncate">Script Version</span>
            <span class="col-8 col-sm-9 text-truncate">
              {{ tx.txScript }}
              <span :class="`badge badge-soft-${$store.getters.getTxScriptBadgeColor(tx.version, tx.txScript)}`"
                    v-tooltip.bottom="$store.getters.getTxScriptText(tx.version, tx.txScript)">
                {{ $store.getters.getTxScriptText(tx.version, tx.txScript) }}
              </span>
            </span>
          </div>

          <div class="row pt-2 pb-2">
            <span class="col-4 col-sm-3 text-truncate">Nonce</span>
            <span class="col-8 col-sm-9 text-truncate">{{ tx.nonce }}</span>
          </div>

          <div class="row pt-2 pb-2  bg-light">
            <span class="col-4 col-sm-3 text-truncate">Fee</span>
            <span class="col-8 col-sm-9 text-truncate">{{ tx.fee }}</span>
          </div>

          <div class="row pt-2 pb-2">
            <span class="d-none d-sm-inline col-12 col-sm-3 text-truncate">Data</span>
            <span class="col-12 col-sm-9 text-truncate">
              <show-transaction-data :tx="tx"/>
            </span>
          </div>

          <div class="row pt-2 pb-2  bg-light">
            <span class="col-12 col-sm-3 text-truncate">Plain Text Memo</span>
            <span class="col-12 col-sm-9 text-truncate">
              <template v-if="tx.dataVersion.eq( PandoraPay.enums.transactions.TransactionDataVersion.TX_DATA_PLAIN_TEXT)"
                        v-tooltip.bottom="`${Buffer.from(tx.data, 'hex').toString()}`">
                  {{ Buffer.from(tx.data, "base64").toString() }}
              </template>
            </span>
          </div>

          <div class="row pt-2 pb-2 " v-if="$store.state.settings.expert">
            <span class="col-4 col-sm-3 text-truncate">Memo as Base64</span>
            <template v-if="tx.dataVersion.eq( PandoraPay.enums.transactions.TransactionDataVersion.TX_DATA_PLAIN_TEXT)" v-tooltip.bottom="`${tx.data}`">
              {{ tx.data }}
            </template>
          </div>

          <template v-if="tx.txScript.equals(PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_RESOLUTION_CONDITIONAL_PAYMENT)">

            <div class="row pt-2 pb-2  bg-light">
              <span class="col-4 col-sm-3 text-truncate">Tx Id</span>
              <span class="col-12 col-sm-9 text-truncate">
                <router-link :to="`/explorer/tx/${$strings.base64ToHex(tx.extra.txId)}`">
                  {{ $strings.base64ToHex(tx.extra.txId) }}
                </router-link>
              </span>
            </div>

            <div class="row pt-2 pb-2 ">
              <span class="col-4 col-sm-3 text-truncate">Payload</span>
              <span class="col-12 col-sm-9 text-truncate">{{ tx.extra.payloadIndex }}</span>
            </div>

            <div class="row pt-2 pb-2  bg-light">
              <span class="col-4 col-sm-3 text-truncate">Resolution</span>
              <span class="col-12 col-sm-9 text-truncate">{{ tx.extra.resolution ? 'Receiver' : 'Sender' }}</span>
            </div>

            <div v-for="(pub, i) in tx.extra.multisigPublicKeys" class="row pt-2 pb-2" :key="`multisig-public-key-${i}`">
              <span class="col-4 col-sm-3 text-truncate">Multisig Public Key {{ i }}</span>
              <span class="col-12 col-sm-9 text-truncate">{{ pub }}</span>
            </div>

            <div v-for="(sig, i) in tx.extra.signatures" class="row pt-2 pb-2" :key="`signature-${i}`">
              <span class="col-4 col-sm-3 text-truncate">Signature {{ i }}</span>
              <span class="col-12 col-sm-9 text-truncate">{{ sig }}</span>
            </div>

          </template>

        </div>
      </div>

    </template>

    <template v-if="tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER)">

      <div v-for="(payload, index) in tx.payloads" class="pt-2" :key="`tx_payload_${index}`">

        <div :class="`${confirmation ? '': 'card mb-3'}`">
          <div class="card-header bg-light">
            <div class="row align-items-center">
              <div class="col">
                <h5 class="mb-0 text-truncate">Payload {{ index }}</h5>
              </div>
            </div>
          </div>
          <div class="card-body p-3 fs--1">

            <template v-if="payload.asset !== PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64">
              <div class="row pt-2 pb-2">
                <span class="col-4 col-sm-3 text-truncate">Fee Rate</span>
                <span
                    class="col-8 col-sm-9 text-truncate">{{ payload.feeRate }} / 10^{{ payload.feeLeadingZeros }}</span>
              </div>

              <div class="row pt-2 pb-2 bg-light">
                <span class="col-4 col-sm-3 text-truncate">Fee Conversion Rate</span>
                <span class="col-8 col-sm-9 text-truncate">{{payload.feeRate.div( Decimal_10.pow(payload.feeLeadingZeros)) }}</span>
              </div>
            </template>

            <div class="row pt-2 pb-2 ">
              <span class="col-4 col-sm-3 text-truncate">Asset</span>
              <span class="col-8 col-sm-9 text-truncate">
                <router-link :to="`/explorer/asset/${$strings.base64ToHex(payload.asset)}`">
                    {{ $strings.base64ToHex(payload.asset) }}
                </router-link>
              </span>
            </div>

            <div class="row pt-2 pb-2 bg-light">
              <span class="col-4 col-sm-3 text-truncate">Script Version</span>
              <span class="col-8 col-sm-9 text-truncate">
                {{ payload.payloadScript }}
                <span :class="`badge badge-soft-${$store.getters.getTxScriptBadgeColor(tx.version, payload.payloadScript)}`"
                      v-tooltip.bottom="$store.getters.getTxScriptText(tx.version, payload.payloadScript)">
                  {{ $store.getters.getTxScriptText(tx.version, payload.payloadScript) }}
                </span>
              </span>
            </div>

            <div class="row pt-2 pb-2">
              <span class="col-4 col-sm-3 text-truncate">Burn</span>
              <span class="col-8 col-sm-9 text-truncate"><amount :value="payload.burnValue" sign="-"/></span>
            </div>

            <div class="row pt-2 pb-2 bg-light">
              <span class="col-12 col-sm-3 text-truncate">Sender Ring</span>
              <span class="col-12 col-sm-9">
                <show-transaction-data :tx="tx" :payload="payload" :parity="0"/>
              </span>
            </div>

            <div class="row pt-2 pb-2">
              <span class="col-12 col-sm-3 text-truncate">Recipient Ring</span>
              <span class="col-12 col-sm-9">
                <show-transaction-data :tx="tx" :payload="payload" :parity="1"/>
              </span>
            </div>

            <div class="row pt-2 pb-2 bg-light">
              <span class="col-4 col-sm-3 text-truncate">
                {{payload.dataVersion.eq( PandoraPay.enums.transactions.TransactionDataVersion.TX_DATA_PLAIN_TEXT) ? 'Plain Text ' : ''}}
                {{payload.dataVersion.eq( PandoraPay.enums.transactions.TransactionDataVersion.TX_DATA_ENCRYPTED) ? 'Encrypted ' : ''}}
                Tx Message
              </span>
              <span class="col-8 col-sm-9 text-truncate">
                <template v-if="payload.dataVersion.eq( PandoraPay.enums.transactions.TransactionDataVersion.TX_DATA_PLAIN_TEXT)">
                    <span class="text-truncate" v-tooltip.bottom="`${Buffer.from(payload.data, 'base64').toString()}`">
                      {{ Buffer.from(payload.data, "base64").toString() }}
                    </span>
                </template>
                <template v-else-if="payload.dataVersion.eq( PandoraPay.enums.transactions.TransactionDataVersion.TX_DATA_ENCRYPTED)">
                    <span v-if="!decrypted || !decrypted.zetherTx.payloads[index]" v-tooltip.bottom="`Encrypted Memo`">?</span>
                    <span v-else v-tooltip.bottom="`${$store.getters.printEncryptedTxMemo(decrypted.zetherTx.payloads[index].message)}`">
                      {{ $store.getters.printEncryptedTxMemo(decrypted.zetherTx.payloads[index].message).toString() }}
                    </span>
                </template>
              </span>
            </div>

            <div class="row pt-2 pb-2">
              <span class="col-4 col-sm-3 text-truncate">Amount</span>
              <span class="col-8 col-sm-9 text-truncate">
                <span v-if="!decrypted || !decrypted.zetherTx.payloads[index]" v-tooltip.bottom="`Confidential amount`"> Confidential </span>
                <amount v-else-if="decrypted.zetherTx.payloads[index].whisperSenderValid"
                        :value="decrypted.zetherTx.payloads[index].sentAmount" sign="-" value-class="text-danger"/>
                <amount v-else-if="decrypted.zetherTx.payloads[index].whisperRecipientValid"
                        :value="decrypted.zetherTx.payloads[index].receivedAmount" sign="+" value-class="text-success" />
                <amount v-else v-tooltip.bottom="`You received zero`" :value="Decimal_0" />
              </span>
            </div>

            <div class="row pt-2 pb-2 bg-light">
              <span class="col-4 col-sm-3 text-truncate">Recipient</span>
              <span class="col-8 col-sm-9">
                <span v-if="!decrypted || !decrypted.zetherTx.payloads[index] || !decrypted.zetherTx.payloads[index].recipientPublicKey" v-tooltip.bottom="`Unknown Recipient`"> Anonymous </span>
                <account-identicon v-else :publicKey="decrypted.zetherTx.payloads[index].recipientPublicKey" size="21" outer-size="7"/>
              </span>
            </div>

            <div class="row pt-2 pb-2" v-if="$store.state.settings.expert">
              <span class="col-4 col-sm-3 text-truncate">Parity</span>
              <span class="col-8 col-sm-9 text-truncate">{{ payload.parity ? 'true' : 'false' }}</span>
            </div>

            <div class="row pt-2 pb-2 bg-light" v-if="$store.state.settings.expert">
              <span class="col-4 col-sm-3 text-truncate">Base64 Memo</span>
              <span class="col-8 col-sm-9 text-truncate">
                <template v-if="payload.dataVersion.eq( PandoraPay.enums.transactions.TransactionDataVersion.TX_DATA_PLAIN_TEXT)">
                  <span class="text-truncate" v-tooltip.bottom="`${payload.data}`">{{ payload.data }}</span>
                </template>
                <template v-else-if="payload.dataVersion.eq( PandoraPay.enums.transactions.TransactionDataVersion.TX_DATA_ENCRYPTED)">
                  <span v-if="!decrypted || !decrypted.zetherTx.payloads[index]" v-tooltip.bottom="`Base64 Encrypted Memo`">?</span>
                  <span v-else v-tooltip.bottom="`${decrypted.zetherTx.payloads[index].message}`">
                    {{ decrypted.zetherTx.payloads[index].message }}
                  </span>
                </template>
              </span>
            </div>

            <template v-if="payload.payloadScript.equals(PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_CONDITIONAL_PAYMENT)">
              <div class="row pt-2 pb-2">
                <span class="col-4 col-sm-3 text-truncate">Deadline </span>
                <span class="col-8 col-sm-9 text-truncate">
                  <template v-if="!txInfo || !txInfo.blkHeight">Not included</template>
                  <template v-else-if="$store.state.blockchain.end.minus( payload.extra.deadline ).gte( txInfo.blkHeight )">Deadline expired</template>
                  <template v-else>
                    {{txInfo.blkHeight.plus(payload.extra.deadline).minus($store.state.blockchain.end) }} blocks
                  </template>
                </span>
              </div>
              <div class="row pt-2 pb-2 bg-light">
                <span class="col-4 col-sm-3 text-truncate">Deadline in Time</span>
                <span class="col-8 col-sm-9 text-truncate">
                  <template v-if="!txInfo || !txInfo.blkHeight">Not included</template>
                  <template v-else-if="$store.state.blockchain.end.minus( payload.extra.deadline ).gte( txInfo.blkHeight )">Deadline expired</template>
                  <template v-else>
                    ~ {{$strings.formatMilliseconds(payload.extra.deadline.plus(txInfo.blkHeight).minus($store.state.blockchain.end) * PandoraPay.config.BLOCK_TIME * 1000) }}
                    <i class="fas fa-clock"></i>
                  </template>
                </span>
              </div>
              <div class="row pt-2 pb-2">
                <span class="col-4 col-sm-3 text-truncate">Default Resolution</span>
                <span class="col-8 col-sm-9 text-truncate">{{payload.extra.defaultResolution ? 'Receiver' : 'Sender' }}</span>
              </div>
              <div class="row pt-2 pb-2 bg-light">
                <span class="col-4 col-sm-3 text-truncate">Multisig Threshold</span>
                <span class="col-8 col-sm-9 text-truncate"> {{payload.extra.multisigThreshold }} of {{ payload.extra.multisigPublicKeys.length }}</span>
              </div>
              <div v-for="(pub, key) in payload.extra.multisigPublicKeys" :class="`row pt-2 pb-2 ${key % 2 ? 'bg-light': ''}`">
                <span class="col-4 col-sm-3 text-truncate">Multisig Pub Key {{ key }}</span>
                <span class="col-8 col-sm-9 text-truncate">{{ pub }}</span>
              </div>

              <div class="my-2">
                <router-link :to="{path: '/advanced/sign-resolution-conditional-payment', query:{ txId: $strings.base64ToHex(tx.hash), payloadIndex: index }}"
                    :class="`btn btn-falcon-default rounded-pill me-1 cursor-pointer ${!txInfo || !txInfo.blkHeight || $store.state.blockchain.end.minus( payload.extra.deadline ).gte( txInfo.blkHeight ) ? 'disabled': ''} `">
                  <i class="fa fa-signature"/>
                  Sign Resolution
                </router-link>

                <router-link :to="{path: '/advanced/public/resolution-conditional-payment', query: { txId: $strings.base64ToHex(tx.hash), payloadIndex:index}}"
                    :class="`btn btn-falcon-default rounded-pill me-1 cursor-pointer ${!txInfo || !txInfo.blkHeight || $store.state.blockchain.end.minus( payload.extra.deadline ).gte( txInfo.blkHeight ) ? 'disabled': ''} `">
                  <i class="fa fa-gavel"/>
                  Create Resolution Tx
                </router-link>
              </div>

            </template>

          </div>
        </div>
      </div>

    </template>

    <div :class="`${confirmation ? '': 'card mb-3'}`">
      <div class="card-header bg-light">
        <div class="row align-items-center">
          <div class="col">
            <h5 class="mb-0 text-truncate">Tx Options</h5>
          </div>
        </div>
      </div>
      <div class="card-body p-3 fs--1">
        <div v-for="(fee, index) in fees" :key="`fee_${index}`">
          <div :class="`row pt-2 pb-2 ${index % 2 ? 'bg-light':''}`">
            <span class="col-4 col-sm-3 fw-medium text-truncate">Fee{{ (fees.length > 1) ? index : '' }}</span>
            <span class="col-8 col-sm-9 text-truncate">
              <amount :asset="fee.asset" :value="fee.amount" value-class="text-900 text-danger" sign="-"/>
              <template v-if="fee.amountNative"> => <amount :value="fee.amountNative" value-class="text-900" sign=""/></template>
            </span>
          </div>
        </div>
      </div>
      <div class="card-footer bg-light g-0 d-block p-3">
        <loading-button v-if="canDecrypt && !decrypted" :submit="handleDecryptTx" component="span" icon="fas fa-unlock" text="Decrypt transaction" tooltip="Decrypt transaction to see the amount, shared text and recipient" class-custom="btn btn-falcon-default rounded-pill me-1 mb-1 cursor-pointer"/>
        <loading-button v-if="$store.state.settings.expert" :submit="handleShowJSON" component="span" icon="fas fa-file" text="Show transaction (JSON)" class-custom="btn btn-falcon-default rounded-pill me-1 mb-1 cursor-pointer"/>
        <loading-button v-if="$store.state.settings.expert" :submit="handleShowTxRaw" component="span" icon="fas fa-file-code" text="Show transaction (Binary)" class-custom="btn btn-falcon-default rounded-pill me-1 mb-1 cursor-pointer"/>
      </div>
    </div>

  </div>
</template>

<script>
import ShowTransactionData from "./show-transaction-data"
import Amount from "src/components/wallet/amount"
import AccountIdenticon from "src/components/wallet/account/account-identicon";
import LoadingButton from "src/components/utils/loading-button";

export default {

  components: {ShowTransactionData, Amount, AccountIdenticon, LoadingButton},

  props: {
    tx: {default: null},
    txInfo: {default: null},
    confirmation: {default: false},
  },

  data() {
    return {
      decrypted: null,
    }
  },

  computed: {

    fees() {
      if (!this.tx) return []

      if (this.tx.version.eq(PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE)) {
        return [{amount: this.tx.fee, asset: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64, feeRate: 1}]
      } else if (this.tx.version.eq(PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER)) {

        const out = []
        for (const payload of this.tx.payloads)
          out.push({
            amount: payload.statement.fee,
            amountNative: payload.asset !== PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64 ? payload.statement.fee.mul(payload.feeRate).div( Decimal_10.pow(payload.feeLeadingZeros)) : null,
            asset: payload.asset,
            feeRate: payload.feeRate
          })

        return out
      }

    },

    publicKey() {
      return this.$store.state.wallet.mainPublicKey
    },

    canDecrypt() {
      if (!this.tx || !this.publicKey) return false

      if (this.tx.version.eq(PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER)) {
        for (const payload of this.tx.payloads)
          for (const publicKey of payload.statement.publickeylist)
            if (publicKey === this.publicKey)
              return true
      }
    },

  },

  methods: {


    async handleDecryptTx(resolve) {
      const decrypted = await this.$store.dispatch('decryptTx', {hash: this.tx.hash, publicKey: this.publicKey})
      if (decrypted) this.decrypted = decrypted
    },

    loadTxDecrypted(txHash, publicKey) {
      const decrypted = localStorage.getItem(`txDecrypted:${txHash}:${publicKey}`)
      if (decrypted) this.decrypted = JSONParse(decrypted)
      else this.decrypted = null
    },

    handleShowJSON() {
      return this.$store.state.page.inputModal.showModal({ title: "TX JSON", data: JSONStringify(this.tx, null, 2),
        textarea: { allowEdit:false, class:"form-control-sm fs--2", rows: 20 }, button: null } )
    },

    handleShowTxRaw() {
      return this.$store.state.page.inputModal.showModal({ title: "TX JSON", data:this.tx._serialized,
        textarea: { allowEdit:false, class:"form-control-sm fs--2", rows: 20 }, button: null })
    },


  },

  watch: {
    tx: {
      immediate: true,
      handler: function (to, from) {
        if (to === from) return
        return this.loadTxDecrypted(to.hash, this.publicKey)
      }
    },
    publicKey: {
      immediate: true,
      handler: function (to, from) {
        if (to === from) return
        return this.loadTxDecrypted(this.tx.hash, to)
      }
    },
  },

}
</script>