<template>

    <div class="identicon outer" :style="`padding: ${outerSize}px; background-color: ${background}`">
        <img v-if="addressIdenticon" :src="addressIdenticon" class="identicon" :style="`width: ${size}px`" >
    </div>

</template>

<script>
const {WalletAddressTypeEnum} = global.blockchain.blockchain.wallet;
export default {

    props:{
        size: 40,
        outerSize: 34,
        outerColor: {default: "white;"},
        identicon: "",

        address: {default: ""},
        publicKey: null,
        publicKeyHash: null,
        type: {default: 0},

    },

    computed:{

        background(){
            return this.outerColor;
        },

        addressIdenticon(){

            try{

                if (this.identicon) return this.identicon;

                let address;

                if (this.address) {
                    address = PandoraPay.cryptography.addressValidator.validateAddress(this.address);
                    if (!address) throw {message: "Invalid address"};
                }

                if (this.publicKey){
                    address = PandoraPay.cryptography.addressGenerator.generateAddressFromPublicKey( this.publicKey );
                    if (!address) throw {message: "Invalid address"};
                }

                if (this.publicKeyHash){
                    address = PandoraPay.cryptography.addressGenerator.generateAddressFromPublicKeyHash( this.publicKeyHash );
                    if (!address) throw {message: "Invalid address"};
                }

                return address ? address.identiconImg() : undefined;


            }catch(err){
                console.error("Identicon error", err);
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