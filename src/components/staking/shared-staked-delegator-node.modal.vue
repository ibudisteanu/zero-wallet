<template>

  <modal ref="modal" :title="`${ 'Notify Node' }`" content-class="">

    <template v-slot:body>
      <wait-address :address="walletAddress">
        <wizard :titles="{
                 0: {icon: 'fas fa-globe-americas', name: 'Select Node', tooltip: 'Select Node you are delegating to' },
                 1: {icon: 'fas fa-robot', name: 'Node Info', tooltip: 'Node information' },
                 2: {icon: 'fas fa-piggy-bank', name: 'Delegate', tooltip: 'Finalizing the delegate' }}"
                :onSetTab="setTab" controls-class-name="modal-footer bg-light" :buttons="buttons" :allow-scroll="false">

          <template v-slot:tab_0>
            <div class="form">
              <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Selecting Node to
                delegate:</label>
              <select v-if="delegatesNodes" class="form-select" v-model="selectedDelegateNode">
                <option v-for="(node, id) in delegatesNodes" :key="`send-money-${id}`" :value="id">
                  {{ node.name }} || {{ delegateNodeAddress(id) }}
                </option>
              </select>
            </div>
          </template>

          <template v-slot:tab_1 v-if="nodeInfo">

            <label class="form-label">Chain Blocks: <strong>{{ nodeInfo.blocks }}</strong></label> <br/>
            <label class="form-label">Delegates MAXIMUM slots: <strong>{{ nodeInfo.maximumAllowed }}</strong></label>
            <br/>
            <label class="form-label">Delegates Already: <strong>{{ nodeInfo.delegatesCount }}</strong></label> <br/>
            <label class="form-label">Delegates SLOTS:
              <strong>
                {{nodeInfo.maximumAllowed.minus(nodeInfo.delegatesCount) }}
              </strong>
            </label>
            <br/>

            <div class="form-check">
              <input class="form-check-input" id="accepted" type="checkbox" v-model="accepted"/>
              <label class="form-check-label" for="accepted">This option requires your account to have a <strong>spend
                key</strong> assigned to your address. If you don't have one set and registered on the blockchain, the
                delegator can steal your funds from this address.</label>
            </div>

          </template>

        </wizard>
      </wait-address>
    </template>

  </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import HttpHelper from "src/utils/http-helper"
import Wizard from "src/components/utils/wizard"
import WaitAddress from "src/components/wallet/account/wait-address";
import Decimal from "decimal.js"
import LoadingButton from "src/components/utils/loading-button"

export default {

  components: {Modal, Wizard, WaitAddress, LoadingButton},

  data() {
    return {
      publicKey: "",

      delegatesNodes: null,
      selectedDelegateNode: null,

      nodeInfo: null,

      accepted: false,

      output: null,
    }
  },

  computed: {

    walletAddress() {
      return this.$store.state.wallet.addresses[this.publicKey];
    },
    account() {
      return this.$store.state.accounts.list[this.publicKey]
    },
    buttons() {
      return {1: {icon: 'fas fa-laptop-code', text: this.notify ? 'Stake to Node' : 'Notify the node'}}
    },

  },

  methods: {

    async setTab({oldTab, value}) {

      if (oldTab === 0 && value === 1)
        await this.handleConnectNode()

      if (oldTab === 1 && value === 2)
        await this.handleNotifyDelegator()

      return true
    },

    async showModal(publicKey, notify = false,) {
      Object.assign(this.$data, this.$options.data.apply(this))

      this.publicKey = publicKey
      this.notify = notify

      this.delegatesNodes = JSONParse(MyTextDecode(await PandoraPay.config.helpers.getNetworkDelegatorNodes()))
      await this.$refs.modal.showModal();

      return this.output
    },

    closeModal() {
      return this.$refs.modal.closeModal();
    },

    delegateNodeAddress(delegateNodeIndex) {
      return this.delegatesNodes[delegateNodeIndex].url.replace("ws", "http").replace("/ws", "")
    },

    async handleConnectNode() {

      this.nodeInfo = null;
      let out

      if (this.selectedDelegateNode === null) throw "You need to select a node"

      try {
        out = await HttpHelper.get(this.delegateNodeAddress(this.selectedDelegateNode) + '/ping');
      } catch (err) {
        throw "Node is offline";
      }

      if (!out || out.ping !== "pong") throw "Invalid ping answer"

      try {
        out = await HttpHelper.get(this.delegateNodeAddress(this.selectedDelegateNode) + '/delegator-node/info');
      } catch (err) {
        throw "Node is not configured to receive delegates";
      }

      if (!out) throw "Node did not answer";

      if (!(out.delegatesCount instanceof Decimal)) throw "delegatesCount is missing"
      if (!(out.maximumAllowed instanceof Decimal)) throw "maximumAllowed is missing"

      if (out.maximumAllowed.lte(out.delegatesCount)) throw "Node is Full"

      this.nodeInfo = out;

    },

    async handleNotifyDelegator() {

      if (!this.nodeInfo) throw "NodeInfo was not assigned"

      if (!this.accepted) throw "You need to accept the condition"
      if (!this.account || !this.account.registration || !this.account.registration.spendPublicKey.length) throw "You account doesn't have Spend Public Key assigned. It is not safe to share for stake"

      const password = await this.$store.state.page.walletPasswordModal.showModal()
      if (password === null) return

      let balance
      for (const availableAccount of this.account.accounts)
        if (availableAccount.asset === PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64) {
          balance = availableAccount.balance
          break
        }

      let out = await this.$store.state.page.decryptBalanceModal.showModal(this.$store.state.wallet.mainPublicKey, balance, PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64, true, password)
      if (out.decryptedBalance === null) throw "Decrypting was canceled"

      out = await HttpHelper.get(this.delegateNodeAddress(this.selectedDelegateNode) + '/delegator-node/notify', {
        sharedStakedPrivateKey: out.privateKey,
        sharedStakedBalance: out.decryptedBalance,
      });

      if (!out) throw "Node is offline";

      if (typeof out.result !== "boolean") throw "exists is not a boolean"
      if (!out.result)
        throw `Delegator node returned false.`

      this.$store.dispatch('addToast', {
        type: 'success',
        title: 'Success sharing your staked address',
        text: 'You staked address has been shared with this delegator node!'
      });

      this.closeModal()
    },

  },

}
</script>

<style scoped>
</style>
