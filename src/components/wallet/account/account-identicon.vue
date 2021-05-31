<template>

    <div class="identicon outer" :style="`padding: ${outerSize}px; background-color: ${background}`">
        <img :src="identiconSrc" class="identicon" :style="`width: ${size}px`" >
    </div>

</template>

<script>

import Identicons from "src/utils/identicons"

export default {

    props:{
        size: {default: 40},
        outerSize: {default: 34},
        outerColor: {default: "white;"},
        version: {default: 0},

        identicon: {default: null},
        address: {default: ""},
        publicKey: {default: null},
        publicKeyHash: {default: null},
    },

    data(){
        return{
            identiconSrc: "",
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
                    this.identiconSrc = await Identicons.getIdenticon(newVal)
                }
            }
        },
        publicKey: {
            immediate: true,
            handler: async function(newVal, oldVal){
                if (newVal){
                    const publicKeyHash = await PandoraPay.cryptography.computePublicKeyHash(newVal)
                    this.identiconSrc = await Identicons.getIdenticon(publicKeyHash)
                }
            }
        },
        address: {
            immediate: true,
            handler: async function(newVal, oldVal){
                if (newVal) {
                    const address = await PandoraPay.addresses.decodeAddress(newVal)
                    this.identiconSrc = await Identicons.getIdenticon(address.publicKeyHash)
                }
            }
        }
    },

    computed:{

        background(){
            return this.outerColor;
        },

        addressIdenticon(){

            if (this.identicon) return this.identicon;

            try {

                    // let address;
                    //
                    // if (this.address) {
                    //     address = PandoraPay.cryptography.addressValidator.validateAddress(this.address);
                    //     if (!address) throw Error("Invalid address");
                    // }

            } catch(err){

            }

        },

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
    }

</style>
