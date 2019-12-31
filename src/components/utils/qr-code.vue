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
        data: '',
    },

    data(){
        return {
            size: 256,
            bgColor: '#fff',
            fgColor: '#000',
            //logo: 'https://s.gravatar.com/avatar/cc8931e95990f00dabb6c27d822477a9?size=100&default=retro'
        }
    },

}
</script>

<style scoped>
    .qr{
        /* set border styling */
        border-color: #b1d2fc;
        border-style: solid;
        border-width: 10px;

        /* set border roundness */
        border-radius: 15px;
        -moz-border-radius: 15px;
        -webkit-border-radius: 15px;
        display: inline-block;
    }
</style>