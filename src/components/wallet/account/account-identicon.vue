<template>
  <identicon :hash="identiconHash" :size="size" :outer-size="outerSize"
             :uri="`${disableRoute ? '' : '/address/'+finalAddress}`" :tooltip="showTooltip ? $strings.truncateText(this.finalAddress, 4, 10) : ''"/>
</template>

<script>

import Identicons from "src/utils/identicons"
import StringHelper from "src/utils/string-helper";
import Identicon from "src/components/utils/identicon"

export default {

  components: {Identicon},

  props: {
    size: {default: 40},
    outerSize: {default: 34},

    address: {default: null},
    publicKey: {default: ""},
    hash: {default: ""},

    disableRoute: {default: false},
    showTooltip: {default: true},
  },

  data() {
    return {
      identiconHash: "",
      finalAddress: "",
    }
  },

  watch: {

    hash: {
      immediate: true,
      handler: async function (newVal, oldVal) {
        if (!newVal) return
        try {
          this.identiconHash = newVal
        } catch (err) {
          this.finalAddress = ""
          this.identiconHash = ""
        }
      }
    },

    publicKey: {
      immediate: true,
      handler: async function (newVal, oldVal) {
        if (!newVal) return
        try {
          const out = await PandoraPay.addresses.createAddress(MyTextEncode(JSONStringify({
            publicKey: newVal,
            registration: "",
            paymentID: "",
            paymentAmount: 0,
            paymentAsset: ""
          })))
          const json = JSONParse(MyTextDecode(out))
          this.identiconHash = newVal
          this.finalAddress = json[1]
        } catch (err) {
          this.finalAddress = ""
          this.identiconHash = ""
        }
      }
    },
    address: {
      immediate: true,
      handler: async function (newVal, oldVal) {

        if (!newVal) return

        try {
          const addressData = await PandoraPay.addresses.decodeAddress(newVal)
          const address = JSONParse(MyTextDecode(addressData))
          this.identiconHash = address.publicKey
          this.finalAddress = newVal
        } catch (err) {
          this.finalAddress = ""
          this.identiconHash = ""
        }
      }
    }
  },

  computed: {

  }


}
</script>
