<template>
    <i class="fas fa-circle-notch fa-spin" :style="`width: ${width}; height: ${height}`"></i>
</template>

<script>
    export default{
        props:{
            width: {default: '40px'},
            height: {default: '40px'},
        }
    }
</script>