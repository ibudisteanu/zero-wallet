<template>

    <div class="identicon outer" :style="`padding: ${outerSize}px; background-color: ${background}`">
        <img :src="addressIdenticon" class="identicon" :style="`width: ${size}px`" >
    </div>

</template>

<script>
export default {

    props:{
        size: {default: 40},
        outerSize: {default: 34},
        outerColor: {default: "white;"},
        type: {default: 0},

        identicon: {default: ""},
        address: {default: ""},
        publicKey: {default: null},
        publicKeyHash: {default: null},
    },

    computed:{

        background(){
            return this.outerColor;
        },

        addressIdenticon(){

                try {

                    if (this.identicon) return this.identicon;

                    // let address;
                    //
                    // if (this.address) {
                    //     address = PandoraPay.cryptography.addressValidator.validateAddress(this.address);
                    //     if (!address) throw Error("Invalid address");
                    // }
                    //
                    // if (this.publicKey) {
                    //     address = PandoraPay.cryptography.addressGenerator.generateAddressFromPublicKey(this.publicKey);
                    //     if (!address) throw Error("Invalid publicKey");
                    // }
                    //
                    // if (this.publicKeyHash) {
                    //     address = PandoraPay.cryptography.addressGenerator.generateAddressFromPublicKeyHash(this.publicKeyHash);
                    //     if (!address) throw Error("Invalid publicKeyHash");
                    // }
                    //
                    // return address ? address.identiconImg() : undefined;

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
