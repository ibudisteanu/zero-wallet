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

        if (typeof localStorage !== "undefined" && !localStorage.getItem('dark') )
            localStorage.setItem('dark', 'true')

        if (typeof localStorage !== "undefined" && localStorage.getItem('dark') === 'true')
            document.getElementsByTagName("html")[0].classList.add('dark');

        const formatLoadedSize = function (loaded, total){
            return `${( Math.min(loaded, total) / 1024 / 1024 ).toFixed(2)}mb / ${( total / 1024 / 1024).toFixed(2)}mb`
        }

        try{

            this.isDownloading = true;

            const integration = new PandoraPayWebworkerIntegration( "PandoraPay", "wasm/PandoraPay-wallet-main.wasm", "workers/PandoraPay-webworker.js",(status)=>{
                this.progressStatus = status
            }, async ()=>{

                await PandoraPay.helpers.helloPandora()
                this.progressStatus = "PandoraPay WASM is working!"
                PandoraPayWallet.loadWallet()


                global.PandoraPayHelperPromise = new Promise((resolver)=>{

                    //for debugging only
                    //return resolver(true)

                    //let download the
                    setTimeout(async ()=>{

                        const integrationHelper = new PandoraPayWebworkerIntegration("PandoraPayHelper", "wasm/PandoraPay-wallet-helper.wasm", "workers/PandoraPay-helper-webworker.js", (status)=>{
                            console.log("PandoraPayHelper status:", status)
                        }, async ()=>{

                            let promiseDecoderResolve, promiseDecoderReject
                            PandoraPayHelper.promiseDecoder = new Promise((resolve, reject)=>{
                                promiseDecoderResolve = resolve
                                promiseDecoderReject = reject
                            })

                            await PandoraPayHelper.helloPandoraHelper()
                            console.log("PandoraPayHelper WASM is working")

                            resolver(true)

                            const balanceDecoderTableSize = Number.parseInt( localStorage.getItem('balanceDecoderTableSize') || '18');

                            const promise = PandoraPayHelper.wallet.initializeBalanceDecoder( 2**balanceDecoderTableSize, status =>{
                                if (PandoraPayHelper.balanceDecoderCallback) PandoraPayHelper.balanceDecoderCallback(status)
                            })

                            promise
                                .then( answ => promiseDecoderResolve(answ) )
                                .catch( err => promiseDecoderReject(err) )

                            await promise
                        } )

                        let lastSize = 0
                        const r = await integrationHelper.downloadWasm((loaded, total)=>{
                            if (loaded - lastSize > 5*1024){
                                lastSize = loaded
                                console.log( 'WASM: ' + formatLoadedSize(loaded, total ) )
                            }
                        })
                        const data = await r.arrayBuffer()
                        integrationHelper.createWorker()
                        integrationHelper.initialize(data)

                    }, 100)

                })

            })

            let lastSize = 0
            const r = await integration.downloadWasm((loaded, total)=>{
                if (loaded - lastSize > 5*1024) {
                    lastSize = loaded
                    this.progressStatus = 'WASM: ' + formatLoadedSize(loaded, total)
                }

            })

            this.isDownloading = false;

            this.progressStatus = "WASM serializing...";
            const data = await r.arrayBuffer()
            this.progressStatus = "PandoraPay WASM instantiating...";

            integration.createWorker()
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
