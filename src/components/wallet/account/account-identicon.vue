<template>

    <div class="outer" :style="`width: ${outerSize}px; height: ${outerSize}px`">
        <img :src="identicon" class="identicon" :style="`width: ${size}px`" >
    </div>

</template>

<script>
export default {

    props:{
        size: 40,
        outerSize: 34,
        identicon: "",
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