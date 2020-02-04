<template>

    <div class="identicon outer" :style="`padding: ${outerSize}px`">
        <img v-if="addressIdenticon" :src="addressIdenticon" class="identicon" :style="`width: ${size}px`" >
    </div>

</template>

<script>
export default {

    props:{
        size: 40,
        outerSize: 34,
        identicon: "",

        address: "",
        publicKey: null,
        publicKeyHash: null,

    },

    computed:{

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
        display: inline-block;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        -khtml-border-radius: 50%;
        border-radius: 50%;
        overflow: hidden;
        padding: 10px;
        background-color: white;
    }

    .identicon{
    }

</style>