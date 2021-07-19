<template>
    <div>
        <qrcode-vue class="qr"
                    :size="size"
                    :value="data"
                    :logo="logo"
                    :bgColor="bgColor"
                    :fgColor="fgColor"
        />
    </div>
</template>

<script>

import qrcodeVue from "qrcode-vue";

export default {

    components: { qrcodeVue },

    props: {
        data: {default: ''},
        size: {default: 256}
    },

    data(){
        return {
            bgColor: '#fff',
            fgColor: '#000',
            logo: require('src/assets/pandora-pay-logo-square.png').default,
        }
    },

}
</script>

<style >
    .qr{
        width: 100%;
        /* set border styling */
        border-color: #eeeeee;
        border-style: solid;
        border-width: 10px;

        /* set border roundness */
        border-radius: 15px;
        -moz-border-radius: 15px;
        -webkit-border-radius: 15px;
        display: inline-block;
    }

    .qr img {
        width: 100%;
    }

</style>
