<template>

    <div class="account">
        <img :src="identicon" class="circle identicon">
        <i class="fa fa-chevron-down"></i>
    </div>

</template>

<script>

export default {

}

</script>

<style scoped>

    .account{
        margin-left:auto;
        margin-right:0;
        cursor: pointer;
    }

    .identicon{
        width: 40px;
    }

</style>