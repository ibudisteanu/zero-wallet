<template>
    <div id="pandora-wallet-intro" >

        <main class="container">

            <div class="center">

                <img :src="require('src/assets/pandora-pay-logo-square.png').default" class="logo" >

                <svg width="200px" height="200px" viewBox="0 0 33 33">
                    <polygon class="triangle" fill="none" stroke="#fff" stroke-width="1" points="16,1 32,32 1,32" />
                </svg>

                <div class="loading-text-div">
                    <alert-box v-if="error" type="error">{{error}}</alert-box>
                    <span v-else class="loading-text">
                        <i v-if="isDownloading" class="fas fa-sync fa-spin"></i>
                        {{progressStatus}}
                    </span>
                </div>
            </div>

        </main>

    </div>
</template>

<script>

import consts from "consts/consts"
import AlertBox from "src/components/utils/alert-box"
import PandoraPayWebworkerIntegration from './pandorapay-webworker-integration'

export default {

    components: { AlertBox },

    data(){
        return {
            progressStatus: "Initialized",
            isDownloading: false,
            error: "",
        }
    },

    async mounted(){

        if (typeof window === "undefined") return;

        if (typeof localStorage !== "undefined" && ( localStorage.getItem('dark') === 'true' || !localStorage.getItem('dark') ))
            document.getElementsByTagName("html")[0].classList.add('dark');

        const self = this

        this.isDownloading = true;

        try{
            const response = await fetch(PandoraPayWalletOptions.resPrefix+"PandoraPay-wallet.wasm", {
                headers: {
                    'Content-Encoding': 'gzip',
                }
            })

            if (!response.ok)
                throw response.status+' '+response.statusText

            if (!response.body)
                throw 'ReadableStream not yet supported in this browser.'

            // to access headers, server must send CORS header "Access-Control-Expose-Headers: content-encoding, content-length x-file-size"
            // server must send custom x-file-size header if gzip or other content-encoding is used
            const contentEncoding = response.headers.get('content-encoding');
            let contentLength = response.headers.get( contentEncoding ? 'x-file-size' : 'content-length');
            if (contentLength === null && contentEncoding) {
                console.error('Response size header unavailable for encoded');
                contentLength = response.headers.get('content-length');
            }

            if (contentLength === null)
                throw "Response size header unavailable"

            const total = parseInt(contentLength, 10);
            let loaded = 0;

            let r = await ( new Response(
                new ReadableStream({
                    start(controller) {
                        const reader = response.body.getReader();

                        let lastTransferred = 0
                        function read() {
                            reader.read().then(({done, value}) => {
                                if (done) {
                                    controller.close();
                                    return;
                                }
                                loaded += value.byteLength;

                                if (loaded - lastTransferred > 10240) {
                                    lastTransferred = loaded
                                    self.progressStatus = `WASM:  ${(loaded / 1024 / 1024 /3).toFixed(2)}mb / ${( total / 1024 / 1024).toFixed(2)}mb`
                                }

                                controller.enqueue(value);
                                read();

                            }).catch(error => {
                                controller.error(error)
                            })
                        }

                        read();

                    }
                })
            ) );

            this.isDownloading = false;

            this.progressStatus = "WASM serializing...";

            let data = await r.arrayBuffer()

            this.progressStatus = "PandoraPay WASM instantiating...";

            const integration = new PandoraPayWebworkerIntegration()
            integration.initializeStatusEvent = (status)=>{
                self.progressStatus = status
            }
            integration.initialize(data)

        }catch(err){
            this.error = err.toString()
        }


    }

    //based on https://codepen.io/alexrmota/pen/NWqwGyJ

}
</script>

<style scoped>

    .logo{
        max-width: 60px;
        position: absolute;
        margin-top: 95px;
        margin-left: 65px;
    }

    .dark .logo{
        -webkit-filter: drop-shadow( 0px 0px 20px rgba(255, 255, 255, 1));
        filter: drop-shadow( 0px 0px 20px rgba(255, 255, 255, 1));
    }

    .loading-text-div{
        text-align: center;
        margin-top:20px
    }

    .loading-text{
        font-family: sans-serif;
        font-size: 12px;
        animation: blink .9s ease-in-out infinite;
    }

    .dark .loading-text{
        -webkit-filter: drop-shadow( 0px 0px 4px rgba(255, 255, 255, 0.5));
        filter: drop-shadow( 0px 0px 4px rgba(255, 255, 255, 0.5));
    }

    .container {
        height: 100vh;
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

    .dark .logo{
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
