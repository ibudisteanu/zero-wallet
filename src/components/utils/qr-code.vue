<template>
    <div>
        <qrcanvas v-if="loaded" class="qr" :width="512" :height="512" :options="options"/>
    </div>
</template>

<script>

const { QRCanvas } = require('qrcanvas-vue');

export default {

    components: {
        qrcanvas: QRCanvas,
    },

    props: {
        data: {default: ''},
    },

    data(){
        return {
            img: "",
            logo: require('src/assets/pandora-pay-logo-square.png').default,
            loaded: false,
            options: {
                data: this.data,
                padding: 15
            }
        }
    },

    computed:{
        bgColor(){
            return this.$store.state.settings.dark ? '#000' : '#fff'
        },
        fgColor(){
            return this.$store.state.settings.dark ? '#fff' : '#000'
        }
    },

    mounted(){
        const img = new Image()
        img.src = this.logo
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
        /* set border styling */
        border-color: white;
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
