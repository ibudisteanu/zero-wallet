<template>

    <router-link :to="`/address/${finalAddress}`" :class="{ disabled: !finalAddress || disableRoute }" :alt="finalAddress">
        <div class="identicon outer" :style="`padding: ${outerSize}px`">
            <img :src="identiconSrc" class="identicon" :style="`width: ${size}px`" >
        </div>
    </router-link>

</template>

<script>

import Identicons from "src/utils/identicons"

export default {

    props:{
        size: {default: 40},
        outerSize: {default: 34},

        identicon: {default: null},
        address: {default: ""},
        publicKey: {default: null},
        publicKeyHash: {default: null},

        disableRoute: { default: false }
    },

    data(){
        return{
            identiconSrc: "",
            finalAddress: "",
        }
    },

    watch:{
        identicon: {
            immediate: true,
            handler: function(newVal, oldVal){
                this.identiconSrc = newVal
            }
        },
        publicKeyHash: {
            immediate: true,
            handler: async function(newVal, oldVal){
                if (newVal) {
                    try{
                        const out = await PandoraPay.addresses.generateAddress(newVal)
                        this.identiconSrc = await Identicons.getIdenticon(newVal)
                        this.finalAddress = out[1]
                    }catch(err){
                        this.finalAddress = ""
                        this.identiconSrc = ""
                    }
                }
            }
        },
        publicKey: {
            immediate: true,
            handler: async function(newVal, oldVal){
                if (newVal){
                    try{
                        const publicKeyHash = await PandoraPay.cryptography.computePublicKeyHash(newVal)
                        const out = await PandoraPay.addresses.generateAddress(publicKeyHash)
                        this.identiconSrc = await Identicons.getIdenticon(publicKeyHash)
                        this.finalAddress = out[1]
                    }catch(err){
                        this.finalAddress = ""
                        this.identiconSrc = ""
                    }
                }
            }
        },
        address: {
            immediate: true,
            handler: async function(newVal, oldVal){
                if (newVal) {
                    try{
                        const addressData = await PandoraPay.addresses.decodeAddress(newVal)
                        const address = JSON.parse(addressData)
                        this.identiconSrc = await Identicons.getIdenticon(address.publicKeyHash)
                        this.finalAddress = newVal
                    }catch(err){
                        this.finalAddress = ""
                        this.identiconSrc = ""
                    }
                }
            }
        }
    },

    computed:{
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
