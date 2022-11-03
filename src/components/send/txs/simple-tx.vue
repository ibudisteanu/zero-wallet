<template>
  <wait-account :account="account" :type="accountType">
    <wizard :titles="titles"
            :onSetTab="setTab" :buttons="buttons" controls-class-name="card-footer bg-light" class="card">

      <template v-for="(_, index) in titlesOffset" v-slot:[getTabSlotName(index)]>
        <slot :name="`tab_${index}`"></slot>
      </template>

      <template v-slot:tab_0>

        <tx-extra-data @changed="changedExtraData" :init-data-encrypted="false" />

        <template v-if="$store.state.settings.expert">

          <div class="form-check pt-2">
            <input class="form-check-input" id="fee-version" type="checkbox" name="checkbox" v-model="feeVersion">
            <label class="form-check-label" for="fee-version" v-tooltip.bottom="`Subtract the fee from the unclaimed balance or from the delegated stake.`">Pay Fee from Unclaimed balance</label>
          </div>

          <tx-fee  :allow-zero="true" @changed="changedFee"/>
        </template>

      </template>

      <template v-slot:tab_1>
        <confirm-broadcasting-tx v-if="tx" class="my-3 fs--1" :tx="tx"/>
      </template>

      <template #wizard-footer>
        <alert-box v-if="status" class="w-100" type="info">
          <h4 class="alert-heading fw-semi-bold">Signing Tx...</h4>
          <p>Transaction is being created</p>
          <hr>
          <span class="d-block">Transaction is being created.</span>
          <label class="d-block">Status: {{ status }}</label>
        </alert-box>
      </template>

    </wizard>
  </wait-account>
</template>

<script>
import AlertBox from "../../utils/alert-box";
import TxExtraData from "../tx-extra-data";
import Wizard from "../../utils/wizard";
import TxFee from "../tx-fee";
import WaitAccount from "src/components/wallet/account/wait-account";
import ConfirmBroadcastingTx from "./confirm-broadcasting-tx"
import Decimal from "decimal.js"

export default {
  components: {AlertBox, TxExtraData, Wizard, TxFee, WaitAccount, ConfirmBroadcastingTx},

  data() {
    return {
      fee: {},
      feeVersion: false,

      extraData: {},

      tx: null,
      txSerialized: null,

      status: '',
    }
  },

  props: {
    accountType: {default: "transparent"},
    publicKey: {default: ""},
    titlesOffset: {default: () => ({})}, //{icon, name}
    buttonsOffset: {default: () => ({})},
    beforeProcessCb: {default: null}, //function
    enableFee: {default: true},
    enableSender: {default: true},
    onSetTab: {default: null},
  },

  computed: {
    walletAddress() {
      return this.$store.state.wallet.addresses[this.publicKey];
    },
    account() {
      return this.$store.state.accounts.list[this.publicKey]
    },
    balancesStakeAvailable() {
      const amount = (this.account && this.account.plainAccount && this.account.plainAccount.delegatedStake) ? this.account.plainAccount.delegatedStake.stakeAvailable : Decimal_0
      return {
        [PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64]: {
          amount,
          asset: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64
        }
      }
    },
    getAsset() {
      return this.$store.getters.getAsset(this.asset ? this.asset.asset : null);
    },
    buttons() {
      return {
        0: {icon: 'fas fa-file-signature', text: 'Sign Transaction'},
        1: {icon: 'fas fa-globe-americas', text: 'Propagate Transaction'},
        2: {icon: 'fas fa-check', name: 'Done', tooltip: 'Transaction is propagated to the network' },
        ...this.buttonsOffset,
      }
    },
    titles() {
      return {
        0: {icon: 'fas fa-pencil-alt', name: 'Extra', tooltip: 'Extra information attached in the tx'},
        1: {icon: 'fas fa-search-dollar', name: 'Preview', tooltip: 'Preview the transaction before Propagating'},
        ...this.titlesOffset
      }
    },
  },

  methods: {

    getTabSlotName(index) {
      return `tab_${index}`
    },

    async setTab({oldTab, value}) {

      let skipped = true
      if (oldTab === 0 && value > oldTab) {
        if (this.extraData.validationError) throw this.extraData.validationError
        if (!this.enableFee)
          await this.handeTxProcess()

        skipped = false
      }

      if (oldTab === 1 && value > oldTab) {
        if (this.fee.feeAuto.validationError) throw this.fee.feeAuto.validationError
        if (this.fee.feeManual.validationError) throw this.fee.feeManual.validationError

        await this.handeTxProcess()
        skipped = false
      }

      if (oldTab === 2 && value > oldTab) {
        await this.handlePropagateTx()
        skipped = false
      }

      if (skipped && this.onSetTab) return this.onSetTab( { oldTab, value} )

      return true
    },

    changedExtraData(data) {
      this.extraData = {...this.extraData, ...data,}
    },
    changedFee(data) {
      this.fee = {...this.fee, ...data}
    },

    async handeTxProcess() {

      try {
        this.status = '';

        const password = await this.$store.state.page.walletPasswordModal.showModal()
        if (password === null) return

        let data = {
          nonce: 0,
          sender: "",
        }

        let fee

        if (this.enableFee) fee = this.fee.feeType ? Decimal_0 : this.fee.feeManual.amount

        if (this.enableSender) {
          const nonceOut = await PandoraPay.network.getNetworkAccountMempoolNonce(MyTextEncode(JSONStringify({publicKey: this.publicKey})))

          data.nonce = JSONParse(MyTextDecode(nonceOut)).nonce
          data.sender = this.walletAddress.addressEncoded
        }

        data = {
          ...data,
          data: {
            data: Buffer.from(this.extraData.data).toString("base64"),
            encrypt: this.extraData.type === "encrypted",
            publicKeyToEncrypt: this.extraData.publicKeyToEncrypt,
          },
          fee: this.enableFee ? {
            fixed: fee,
            perByte: Decimal_0,
            perByteExtraSpace: Decimal_0,
            perByteAuto: this.fee.feeType,
          } : null,
          feeVersion: this.feeVersion,
          height: this.$store.state.blockchain.end,
        }

        if (this.beforeProcessCb)
          await this.beforeProcessCb(password, data)

        const out = await PandoraPay.transactions.builder.createSimpleTx(MyTextEncode(JSONStringify(data)),
            status => {
              this.status = status
            }, password);

        if (!out) throw "Transaction couldn't be made";

        this.tx = JSONParse(MyTextDecode(out[0]))
        const serialized = Buffer.from( out[1] )

        this.tx._serialized = serialized.toString("base64")
        this.txSerialized = serialized

        this.status = 'Tx built'

      } finally {
        this.status = ""
      }

    },

    async handlePropagateTx() {

      try {

        this.status = 'Cloning transaction...'

        const txSerialized = Buffer.alloc(this.txSerialized.length)
        Buffer.from(this.txSerialized).copy(txSerialized, 0)

        this.status = 'Propagating transaction...'

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

    }

  },

}
</script>