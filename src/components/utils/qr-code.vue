<template>
    <div>
        <template v-if="!loaded">
            <div class="py-3 text-center"> <loading-spinner class="fs-2"/> </div>
        </template>
        <qrcanvas v-else class="qr" :width="512" :height="512" :options="options"/>
    </div>
</template>

<script>

const { QRCanvas } = require('qrcanvas-vue');
import LoadingSpinner from "src/components/utils/loading-spinner";

/**
 * Documentation here https://gera2ld.github.io/qrcanvas-vue/v2/#simple
 * https://gera2ld.github.io/qrcanvas/examples/#colorful
 */
export default {

    components: {
        qrcanvas: QRCanvas,
        LoadingSpinner,
    },

    props: {
        data: {default: ''},
    },

    data(){
        return {
            img: "",
            logo: require(`src/assets/logo-square.png`).default,
            loaded: false,
            options: {
                data: this.data,
                background: this.$store.state.settings.dark ? '#0b1727' : 'white',
                foreground: this.$store.state.settings.dark ? '#FFD700' : '#3c4ecc',
                padding: 15
            }
        }
    },

    computed:{

    },

    mounted(){
        const img = new Image()
        img.src = this.logo

        if (this.$store.state.settings.mobile){
            img.width = '64'
            img.height = '64'
        }

        img.onload = ()=> {
            this.options = {
                ...this.options,
                logo: {
                    image: img,
                }
            }
            this.loaded = true
        }
    },

}
</script>

<style >
    .qr{
        width: 100%;
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
