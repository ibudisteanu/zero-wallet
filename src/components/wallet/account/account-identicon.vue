<template>

    <router-link :to="`/address/${finalAddress}`" v-tooltip.bottom="`${ showTooltip ? finalAddressShort : '' }`"
                 :is=" !finalAddress || disableRoute ? 'span' : 'router-link'" >
        <div class="identicon outer" :style="`padding: ${outerSize}px`" v-if="identiconSrc">
            <img :src="identiconSrc" class="identicon" :style="`width: ${size}px`" :alt="showTooltip ? finalAddressShort : ''"  >
        </div>
    </router-link>

</template>

<script>

import Identicons from "src/utils/identicons"
import StringHelper from "src/utils/string-helper";
export default {

    props:{
        size: {default: 40},
        outerSize: {default: 34},

        address: {default: ""},
        publicKey: {default: null},

        disableRoute: { default: false },
        showTooltip: {default: true },
    },

    data(){
        return{
            identiconSrc: "",
            finalAddress: "",
        }
    },

    watch:{

        publicKey: {
            immediate: true,
            handler: async function(newVal, oldVal){
                if (!newVal)
                    return
                try{
                    const out = await PandoraPay.addresses.generateAddress( MyTextEncode( JSON.stringify( { publicKey: newVal, registration: "", amount: 0, paymentId: "" })) )
                    const json = JSON.parse( MyTextDecode(out) )
                    this.identiconSrc = await Identicons.getIdenticon(newVal, this.size )
                    this.finalAddress = json[1]
                }catch(err){
                    this.finalAddress = ""
                    this.identiconSrc = ""
                }
            }
        },
        address: {
            immediate: true,
            handler: async function(newVal, oldVal){
                if (!newVal)
                    return

                try{
                    const addressData = await PandoraPay.addresses.decodeAddress(newVal)
                    const address = JSON.parse( MyTextDecode(addressData))
                    this.identiconSrc = await Identicons.getIdenticon(address.publicKey, this.size )
                    this.finalAddress = newVal
                }catch(err){
                    this.finalAddress = ""
                    this.identiconSrc = ""
                }
            }
        }
    },

    computed:{
        finalAddressShort(){
            return StringHelper.truncateText(this.finalAddress, 4, 10)
        }
    }


}
</script>

<style scoped>


    .outer{
        display: inline-table;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        -khtml-border-radius: 50%;
        border-radius: 50%;
        overflow: hidden;
        padding: 10px;
    }

    .identicon{
        background-color: white;
    }

    .dark .identicon{
        background-color: black;
    }

</style>
