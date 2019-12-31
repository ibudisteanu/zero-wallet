<template>
    <div>
        <qr-canvas v-if="image" :options="options" class="qr"></qr-canvas>
    </div>
</template>

<script>

const { QRCanvas } = require('qrcanvas-vue');

export default {

    components: { 'qrCanvas': QRCanvas },

    props: {
        data: '',
    },

    data(){
        return {
            image: undefined,
        }
    },

    computed:{
        options() {
            return {
                cellSize: 10,
                correctLevel: 'H',
                data: this.data,
                logo: this.image ? {
                    image: this.image
                }:undefined,
            }
        }
    },

    created() {
        const image = new Image();
        image.src = 'https://user-images.githubusercontent.com/3139113/38300650-ed2c25c4-382f-11e8-9792-d46987eb17d1.png';
        image.onload = () => {

            this.image = image;

        };
    }

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