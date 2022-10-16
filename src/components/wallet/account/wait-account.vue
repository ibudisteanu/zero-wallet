<template>

  <div>
    <alert-box v-if="!isLoading && !isFound" type="warning">
      Address was not found on the blockchain or is empty!
    </alert-box>
    <template v-else-if="account">
      <alert-box v-if="hasBalanceAvailable" type="warning">
        {{ hasBalanceAvailable }}
      </alert-box>
      <template v-else>
        <slot></slot>
      </template>
    </template>
    <div class="py-3 text-center" v-else>
      <loading-spinner class="fs-3"/>
    </div>
  </div>

</template>

<script>
import AlertBox from "src/components/utils/alert-box"
import LoadingSpinner from "src/components/utils/loading-spinner";

export default {

  components: {AlertBox, LoadingSpinner},

  props: {
    account: {default: "not-found"},
    type: {default: "all"}, //all,transparent,zether
  },

  computed: {
    isLoading() {
      return this.account === "not-found"
    },
    isFound() {
      return this.account !== null
    },
    hasBalanceAvailable() {
      if (this.type === "all")
        if (!this.account) return "This feature requires any kind of funds."

      if (this.type === "transparent")
        if (!this.account || !this.account.plainAccount) return "This feature requires public funds."

      if (this.type === "zether")
        if (!this.account || !this.account.accounts) return "This feature requires private funds."

    },
  }
}
</script>