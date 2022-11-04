<template>
  <div>
    <template v-if="tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE)">

      <template v-if="tx.txScript.eq( PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UPDATE_ASSET_FEE_LIQUIDITY)">
        <div class="input">
          <account-identicon :publicKey="tx.vin.publicKey" size="21" outer-size="7"/>
          <amount :value="vinSimpleAmount" sign="-"/>
        </div>
      </template>

    </template>
    <template v-else-if="tx.version.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER)">

      <div class="output" v-for="(publicKey, index) in payload.statement.publickeylist" :key="`show-transaction-vout-${index}`">
        <template v-if="(index%2 === parity) === payload.parity">
          <account-identicon :publicKey="publicKey" size="21" outer-size="7"/>
          ?
        </template>
      </div>

    </template>
  </div>
</template>

<script>
import AccountIdenticon from "../../wallet/account/account-identicon";
import Amount from "../../wallet/amount";
import Decimal from "decimal.js";

export default {

  components: {AccountIdenticon, Amount},

  props: {
    tx: {default: null},
    payload: {default: null},
    parity: {default: 0},
  },

  computed: {

    vinSimpleAmount() {

      if (!this.tx.version.eq(PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE)) return
      let out = new Decimal(0)

      return out
    }

  }

}
</script>

<style scoped>
.input, .output {
  display: inline-block;
  padding-right: 1px;
}
</style>