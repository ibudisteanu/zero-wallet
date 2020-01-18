<template>

    <div class="identicon outer" :style="`width: ${outerSize}px; height: ${outerSize}px`">
        <img v-if="identicon || address" :src="identicon ? identicon : addressIdenticon" class="identicon" :style="`width: ${size}px`" >
    </div>

</template>

<script>
export default {

    props:{
        size: 40,
        outerSize: 34,
        identicon: "",
        address: "",
    },

    computed:{

        addressIdenticon(){

            try{
                const address = global.apacache._scope.cryptography.addressValidator.validateAddress( this.address );
                if (!address) throw {message: "Invalid address"};

                return address.identiconImg();

            }catch(err){

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