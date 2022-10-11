<template>
  <wait-account :account="account" :type="accountType">
    <wizard :titles="titles"
            @onSetTab="setTab" :buttons="buttons" controls-class-name="card-footer bg-light" class="card">

      <template v-for="(_, index) in titlesOffset" v-slot:[getTabSlotName(index)]>
        <slot :name="`tab_${index}`"></slot>
      </template>

      <template v-slot:tab_0>
        <extra-data @changed="changedExtraData"/>
      </template>

      <template v-slot:tab_1>

        <div class="form-check pb-2">
          <input class="form-check-input" id="fee-version" type="checkbox" name="checkbox" v-model="feeVersion">
          <label class="form-check-label" for="fee-version">Pay Fee from Unclaimed balance</label>
          <i class="fas fa-question ms-1" v-tooltip.bottom="`Subtract the fee from the unclaimed balance or from the delegated stake.`"/>
        </div>

        <tx-fee :balances="balancesStakeAvailable" :allow-zero="true" @changed="changedFee"/>
      </template>

      <template v-slot:tab_2>
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
import ExtraData from "../extra-data";
import Wizard from "../../utils/wizard";
import TxFee from "../tx-fee";
import WaitAccount from "src/components/wallet/account/wait-account";
import ConfirmBroadcastingTx from "./confirm-broadcasting-tx"
import Decimal from "decimal.js"

export default {
  components: {AlertBox, ExtraData, Wizard, TxFee, WaitAccount, ConfirmBroadcastingTx},

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
  },

  computed: {
    walletAddress() {
      return this.$store.state.wallet.addresses[this.publicKey];
    },
    account() {
      return this.$store.state.accounts.list[this.publicKey]
    },
    balancesStakeAvailable() {
      const amount = (this.account && this.account.plainAccount && this.account.plainAccount.delegatedStake) ? this.account.plainAccount.delegatedStake.stakeAvailable : new Decimal(0)
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
        1: {icon: 'fas fa-file-signature', text: 'Sign Transaction'},
        2: {icon: 'fas fa-globe-americas', text: 'Propagate Transaction'},
        ...this.buttonsOffset,
      }
    },
    titles() {
      const o = {
        0: {icon: 'fas fa-pencil-alt', name: 'Memo', tooltip: 'Extra information attached in the tx'},
        2: {icon: 'fas fa-search-dollar', name: 'Preview', tooltip: 'Preview the transaction before Propagating'},
        ...this.titlesOffset
      }
      if (this.enableFee)
        o['1'] = {icon: 'fas fa-dollar-sign', name: 'Fee', tooltip: 'Setting the fee'}
      return o
    },
  },

  methods: {

    getTabSlotName(index) {
      return `tab_${index}`
    },

    async setTab({resolve, reject, oldTab, value}) {
      try {

        if (oldTab === 0 && value > oldTab) {
          if (this.extraData.validationError) throw this.extraData.validationError
          if (!this.enableFee)
            await this.handeTxProcess()

        } else if (oldTab === 1 && value > oldTab) {
          if (this.fee.feeAuto.validationError) throw this.fee.feeAuto.validationError
          if (this.fee.feeManual.validationError) throw this.fee.feeManual.validationError

          await this.handeTxProcess()
        } else if (oldTab === 2 && value > oldTab) {
          await this.handlePropagateTx()
        } else return this.$emit('onSetTab', {resolve, reject, oldTab, value})

        resolve(true)
      } catch (err) {
        reject(err)
      }
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

        if (this.enableFee) fee = this.fee.feeType ? new Decimal(0) : this.fee.feeManual.amount

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
            perByte: new Decimal(0),
            perByteExtraSpace: new Decimal(0),
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
        const serialized = out[1]

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