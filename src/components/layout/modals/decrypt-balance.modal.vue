<template>

  <modal ref="modal" :title="statusTitle" contentClass="" @opened="start" :closing-function="stop">

    <template v-slot:body>

      <canvas id="matrixCanvas"></canvas>

    </template>

  </modal>

</template>

<script>
import Modal from "src/components/utils/modal"
import LoadingSpinner from "../../utils/loading-spinner";
import Decimal from 'decimal.js';

export default {

  components: {LoadingSpinner, Modal},

  data() {
    return {
      matrixInterval: null,
      publicKey: "",
      balance: "",
      asset: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64,
      password: "",
      decryptedBalance: null,
      privateKey: null,
      spendPrivateKey: null,
      returnPrivateKey: false,
      cancelCallback: null,
      status: "",
      statusTitle: "",
      closed: false,
    }
  },

  computed: {
    getAsset() {
      return this.$store.getters.getAsset(this.asset);
    },
  },

  methods: {

    async showModal(publicKey, balance, asset, returnPrivateKey, password) {

      Object.assign(this.$data, this.$options.data.apply(this))

      this.publicKey = publicKey
      this.balance = balance
      this.asset = asset
      this.password = password
      this.returnPrivateKey = returnPrivateKey

      let data = await PandoraPay.wallet.tryDecryptBalance(this.password, MyTextEncode(JSONStringify({
        publicKey: this.publicKey,
        asset: this.asset,
        balance: this.balance,
        previousValue: 0,
      })),)

      const out = JSONParse(MyTextDecode(data))

      data = await PandoraPay.wallet.getPrivateKeysWalletAddress(this.password, MyTextEncode(JSONStringify({
        publicKey: this.publicKey,
        asset: this.asset
      })),)

      const params = JSONParse(MyTextDecode(data))

      if (this.closed) return

      this.privateKey = params.privateKey
      this.spendPrivateKey = params.spendPrivateKey

      if (out.decrypted)
        this.decryptedBalance = out.value
      else
        await this.$refs.modal.showModal();

      return {
        decryptedBalance: this.decryptedBalance,
        privateKey: returnPrivateKey ? this.privateKey : undefined,
        spendPrivateKey: returnPrivateKey ? this.spendPrivateKey : undefined
      }
    },

    closeModal() {
      return this.$refs.modal.closeModal();
    },

    async start() {

      this.startMatrix()

      this.status = "Downloading..."
      this.statusTitle = "Downloading Web Assembly..."
      await PandoraPayHelperPromise
      this.status = ""

      PandoraPayHelper.balanceDecoderCallback = (status) => {
        this.status = "Init  " + status
        this.statusTitle = "Initialize library " + status
      }

      await PandoraPayHelper.decoderPromise
      this.status = ""
      this.statusTitle = ""

      if (this.closed) return

      const decryptedData = await PandoraPayHelper.wallet.decryptBalance(MyTextEncode(JSONStringify({
        publicKey: this.publicKey,
        privateKey: this.privateKey,
        previousValue: 0,
        balance: this.balance,
        asset: this.asset,
      })), async (status) => {
        const final = this.$strings.formatMoney(new Decimal(status).div( Decimal_10.pow(this.getAsset.decimalSeparator), this.getAsset.decimalSeparator.toNumber() ))
        this.status = "Scan  " + final
        this.statusTitle = "Scanning balance  " + final
      })

      this.cancelCallback = decryptedData[1]

      const checkBalance = async () => {

        const result = await decryptedData[0]()

        if (result[2] && result[2] instanceof Error) {
          this.$store.dispatch('addToast', {
            type: 'error',
            title: `Error decrypting your homomorphic balance`,
            text: `${result[2].message}`,
          })
          this.cancelCallback = null
          return this.closeModal()
        } else if (result[0]) {

          this.$store.dispatch('addToast', {
            type: 'success',
            title: `Homomorphic Balance was Decrypted`,
            text: `Decryption successful!`,
          })

          this.decryptedBalance = new Decimal(result[1])

          // await PandoraPay.wallet.updatePreviousDecryptedBalanceValueWalletAddress( MyTextEncode(JSONStringify({
          //     publicKey: this.publicKey,
          //     asset: this.asset,
          //     amount: this.decryptedBalance,
          //     balance: this.balance,
          // })), this.password, )

          this.cancelCallback = null
          return this.closeModal()
        }

        if (this.closed) return

        setTimeout(() => checkBalance(), 500)
      }

      setTimeout(() => checkBalance(), 500)

    },

    async stop() {

      this.closed = true

      if (this.cancelCallback)
        await this.cancelCallback()

      this.stopMatrix()

    },

    stopMatrix() {
      clearInterval(this.matrixInterval)
      this.matrixInterval = null
    },

    startMatrix() {

      const c = document.getElementById("matrixCanvas");
      const context = c.getContext('2d');

      c.height = this.$refs.modal.$refs.refModalBody.clientHeight;
      c.width = this.$refs.modal.$refs.refModalBody.clientWidth;

      let letterSize = 15;
      let columns = c.width / letterSize;

      const heights = [];
      for (let i = 0; i < columns; i++)
        heights[i] = 1;

      let lines = []
      let hasText = []

      let middleLine = Math.floor(c.height / letterSize / 2)

      const createLines = () => {
        lines = [
          "",
          "DECRYPTING",
          this.status.replaceAll(" ", "^"),
          "",
        ].reverse()

        let maxLength = 0
        for (const line of lines)
          if (maxLength < line.length)
            maxLength = line.length

        maxLength += 2
        for (let i = 0; i < lines.length; i++) {
          const initLength = lines[i].length
          lines[i] = new Array(Math.floor((maxLength - initLength) / 2) + 1).join('.') + lines[i]
          lines[i] = lines[i] + new Array((maxLength - lines[i].length) + 1).join('.')
        }

        for (let i = 0; i < lines.length; i++)
          lines[i] = createLine(lines[i])

        hasText = []
        for (let i = 0; i < heights.length; i++) {
          let foundText = false
          for (const line of lines)
            if (line[i] !== ' ') {
              foundText = true
              break
            }
          hasText[i] = hasText
        }
      }

      function createLine(text) {
        text = new Array(Math.floor((heights.length - text.length) / 2) + 1).join(" ") + text
        text = text + new Array(heights.length - text.length + 1).join(" ")
        return text
      }

      function draw() {

        context.fillStyle = "rgba(0,0,0,0.05)";
        context.fillRect(0, 0, c.width, c.height);

        context.fillStyle = "#0f0";
        context.font = letterSize + "px arial";

        createLines()

        for (let i = 0; i < heights.length; i++) {

          let finalCharacter = ''

          for (let j = 0; j < lines.length; j++) {
            if (heights[i] === middleLine - Math.floor(j - (lines.length / 2)) && lines[j][i] !== ' ') {
              finalCharacter = lines[j][i]
              if (finalCharacter === '^') finalCharacter = ' '
            }
          }

          if (finalCharacter === '')
            finalCharacter = selectLetter()

          context.fillText(finalCharacter.split(""), i * letterSize, heights[i] * letterSize);

          if (heights[i] * letterSize > c.height) {
            if (Math.random() > 0.975) heights[i] = 0;
            else if (hasText[i] && Math.random() > 0.7) heights[i] = 0;
          }

          heights[i]++;

        }

      }

      function selectLetter() {
        const selectAsci = Math.floor((Math.random() * 94) + 33);
        return String.fromCharCode(parseInt(selectAsci));
      }

      this.matrixInterval = setInterval(draw, 120);

    }

  }

}

</script>

<style scoped>
#matrixCanvas {
  width: 100%;
  height: 100%;
}
</style>
