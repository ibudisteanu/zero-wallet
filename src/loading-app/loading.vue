<template>
    <div id="pandora-wallet-loading" class="container" >

        <div class="wrapper center">

            <div class="logo-div">
                <img :src="require('src/assets/pandora-pay-logo-inline.png').default" class="logo" >
            </div>

            <div class="container-flex"  >
                <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>

            <div class="loading-div">
                <span class="loading-text">
                    <i v-if="isDownloading" class="fas fa-sync fa-spin"></i>
                    {{progressStatus}}
                </span>
                <span v-if="error" class="danger">
                    {{error}}
                </span>
            </div>

        </div>

    </div>
</template>

<script>

import consts from "consts/consts"
import fetchProgress from 'fetch-progress'

export default {

    data(){
        return {
            progressStatus: "Initialized",
            isDownloading: false,
            error: "",
        }
    },

    mounted(){

        if (typeof window === "undefined") return;

        const self = this

        this.progressStatus = "WASM Handler loading...";

        const script = document.createElement( 'script' );
        script.setAttribute( 'src', './wasm_exec.js' );
        script.onload = async ()=>{

            this.progressStatus = "WASM Handler loaded";

            const go = new Go();
            go.argv = consts.goArgv

            this.progressStatus = "WASM GO created";
            this.isDownloading = true;

            fetch("./PandoraPay-wallet.wasm")
                .then(
                    fetchProgress({
                        // implement onProgress method
                        onProgress(progress) {
                            self.progressStatus = `WASM:  ${(progress.transferred/1024/1024).toFixed(2)}mb / ${(progress.total/1024/1024).toFixed(2)}mb... eta: ${(progress.eta/1000000000).toFixed(1)}s`
                        },
                    })
                ).then((r)=> {

                    this.isDownloading = false

                    // The response (res) can now be passed to any of the streaming methods as normal
                    WebAssembly.instantiateStreaming(r, go.importObject).then(result => {

                        this.progressStatus = "PandoraPay WASM running...";

                        setTimeout(() => {

                            go.run(result.instance)

                            this.progressStatus = "PandoraPay WASM executed";

                            PandoraPayWallet.loadWallet()

                        }, 20)

                    })

                })

        }
        document.body.appendChild( script );

    }

}
</script>

<style scoped>

    .logo{
        width: 100%;
        max-width: 200px;
    }

    .logo-div{
        padding-bottom: 20px;
    }

    .loading-div{
        padding-top: 30px;
    }

    .loading-text{
    }

    .container {
        height: 100%;
    }

    .center{
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    .container-flex {
        display: flex;
    }

    .wrapper {
        width: auto;
        height: auto;
    }
    ul {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        animation: rot 16s linear infinite;
        list-style-type: none;
    }
    @keyframes rot {
        100% {
            transform: rotate(360deg);
        }
    }
    li {
        width: 40px;
        height: 40px;
        background: #651fff;
        border-radius: 4px;
        box-shadow: 0 0 1px #fff, 0 0 5px #651fff, 0 0 10px #651fff, 0 0 15px #651fff, 0 0 25px #651fff, 0 0 55px #651fff;
        animation: scale 0.8s linear alternate infinite;
    }
    @keyframes scale {
        100% {
            transform: scale(0.1);
            opacity: 0;
        }
    }
    li:nth-child(1) {
        z-index: 24;
    }
    li:nth-child(2) {
        z-index: 23;
    }
    li:nth-child(3) {
        z-index: 22;
    }
    li:nth-child(4) {
        z-index: 21;
    }
    li:nth-child(5) {
        z-index: 20;
    }
    li:nth-child(6) {
        z-index: 19;
    }
    li:nth-child(7) {
        z-index: 18;
    }
    li:nth-child(8) {
        z-index: 17;
    }
    li:nth-child(9) {
        z-index: 16;
    }
    li:nth-child(10) {
        z-index: 15;
    }
    li:nth-child(11) {
        z-index: 14;
    }
    li:nth-child(12) {
        z-index: 13;
    }
    li:nth-child(13) {
        z-index: 12;
    }
    li:nth-child(14) {
        z-index: 11;
    }
    li:nth-child(15) {
        z-index: 10;
    }
    li:nth-child(16) {
        z-index: 9;
    }
    li:nth-child(17) {
        z-index: 8;
    }
    li:nth-child(18) {
        z-index: 7;
    }
    li:nth-child(19) {
        z-index: 6;
    }
    li:nth-child(20) {
        z-index: 5;
    }
    li:nth-child(21) {
        z-index: 4;
    }
    li:nth-child(22) {
        z-index: 3;
    }
    li:nth-child(23) {
        z-index: 2;
    }
    li:nth-child(24) {
        z-index: 1;
    }
    li:nth-child(25) {
        z-index: 0;
    }
    li:nth-child(1) {
        animation-delay: 0.1s;
    }
    li:nth-child(7) {
        animation-delay: 0.3s;
    }
    li:nth-child(13) {
        animation-delay: 0.5s;
    }
    li:nth-child(19) {
        animation-delay: 0.7s;
    }
    li:nth-child(24) {
        animation-delay: 0.9s;
    }
    li:nth-child(2) {
        animation-delay: 0.2s;
    }
    li:nth-child(8) {
        animation-delay: 0.4s;
    }
    li:nth-child(14) {
        animation-delay: 0.6s;
    }
    li:nth-child(20) {
        animation-delay: 0.8s;
    }
    li:nth-child(3) {
        animation-delay: 0.3s;
    }
    li:nth-child(9) {
        animation-delay: 0.5s;
    }
    li:nth-child(15) {
        animation-delay: 0.7s;
    }
    li:nth-child(4) {
        animation-delay: 0.4s;
    }
    li:nth-child(10) {
        animation-delay: 0.6s;
    }
    li:nth-child(5) {
        animation-delay: 0.5s;
    }
    li:nth-child(1) {
        animation-delay: 0.1s;
    }
    li:nth-child(6) {
        animation-delay: 0.2s;
    }
    li:nth-child(11) {
        animation-delay: 0.3s;
    }
    li:nth-child(16) {
        animation-delay: 0.4s;
    }
    li:nth-child(21) {
        animation-delay: 0.5s;
    }
    li:nth-child(7) {
        animation-delay: 0.3s;
    }
    li:nth-child(12) {
        animation-delay: 0.4s;
    }
    li:nth-child(17) {
        animation-delay: 0.5s;
    }
    li:nth-child(22) {
        animation-delay: 0.6s;
    }
    li:nth-child(13) {
        animation-delay: 0.5s;
    }
    li:nth-child(18) {
        animation-delay: 0.6s;
    }
    li:nth-child(23) {
        animation-delay: 0.7s;
    }
    li:nth-child(19) {
        animation-delay: 0.7s;
    }
    li:nth-child(24) {
        animation-delay: 0.8s;
    }
    li:nth-child(25) {
        animation-delay: 0.9s;
    }

</style>
