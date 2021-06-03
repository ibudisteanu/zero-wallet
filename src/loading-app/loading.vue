<template>
    <div id="pandora-wallet-loading" class="container" >

        <div class="wrapper center">

            <img :src="require('src/assets/pandora-pay-logo-square.png').default" class="logo" >

            <svg width="200px" height="200px" viewBox="0 0 35 35">
                <polygon class="triangle" fill="none" stroke="#fff" stroke-width="1" points="16,1 32,32 1,32" />
            </svg>

            <div class="loading-text-div">
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
        script.setAttribute( 'src', PandoraPayWalletOptions.resPrefix + 'wasm_exec.js' );
        script.onload = async ()=>{

            this.progressStatus = "WASM Handler loaded";

            const go = new Go();
            go.argv = consts.goArgv

            this.progressStatus = "WASM GO created";
            this.isDownloading = true;

            fetch(PandoraPayWalletOptions.resPrefix+"PandoraPay-wallet.wasm", {
                headers: {
                    'Content-Encoding': 'gzip',
                }
            })
                .then(
                    fetchProgress({
                        // implement onProgress method
                        onProgress(progress) {
                            self.progressStatus = `WASM:  ${(progress.transferred/1024/1024).toFixed(2)}mb / ${(progress.total/1024/1024).toFixed(2)}mb`
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

    //based on https://codepen.io/alexrmota/pen/NWqwGyJ

}
</script>

<style scoped>

    .logo{
        max-width: 60px;
        position: absolute;
        margin-top: 90px;
        margin-left: 60px;
    }

    .loading-text-div{
        text-align: center;
    }

    .loading-text{
        font-family: sans-serif;
        font-size: 12px;
        animation: blink .9s ease-in-out infinite;
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

    body {
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }

    .triangle {
        stroke:#0EB4DB;
        stroke-dasharray: 17;
        animation: dash 2.5s cubic-bezier(0.35, 0.04, 0.63, 0.95) infinite;
    }

    @keyframes dash {
        to {
            stroke-dashoffset: 136;
        }
    }

    @keyframes blink {
        50% {
            opacity: 0;
        }
    }

</style>
