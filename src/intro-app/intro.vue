<template>
  <div>

    <main class="container">

      <div class="center">

        <img :src="require(`src/assets/logo-square${dark?'':''}.png`).default" class="logo" :alt="name">

        <div class="text-center">
          <svg width="200px" height="200px" viewBox="0 0 33 33">
            <polygon class="triangle" fill="none" stroke="#fff" stroke-width="1" points="16,1 32,32 1,32"/>
          </svg>
        </div>

        <h1 class="text-center">{{ name.toUpperCase() }}</h1>

        <div class="loading-text-div">
          <alert-box v-if="error" type="error">{{ error }}</alert-box>
          <span v-else class="loading-text">
              <i v-if="isDownloading" class="fas fa-spinner fa-spin"></i>
              {{ progressStatus }}
          </span>
        </div>
      </div>

    </main>

  </div>
</template>

<script>

import consts from "consts/consts"
import AlertBox from "src/components/utils/alert-box"
import WasmWebworkerIntegration from './wasm-webworker-integration'

export default {

    components: { AlertBox },

    data(){
        return {
            progressStatus: "Initialized",
            isDownloading: false,
            error: "",
            dark: false,
        }
    },

    props: {
      options: {default: null },
    },

    computed:{
        name(){
            return consts.name
        }
    },

    mounted(){

        if (typeof window === "undefined") return;

        if (typeof localStorage !== "undefined" && !localStorage.getItem('dark') )
            localStorage.setItem('dark', this.options.intro.defaultTheme )

        if (typeof localStorage !== "undefined" && localStorage.getItem('dark') === 'true') {
          document.getElementsByTagName("html")[0].classList.add('dark');
          this.dark = true
        }

        if (this.options.intro.startAutomatically) return this.start()

    },

    methods:{

      async start(){

        try{

          this.isDownloading = true;

          const wasmMainSri = global.SRI_WASM_MAIN || ''
          const wasmMainFileSize = global.SIZE_WASM_MAIN || 0

          const integration = new WasmWebworkerIntegration( "PandoraPay", this.options.resPrefix + "wasm/PandoraPay-wallet-main.wasm?"+wasmMainSri, wasmMainSri, wasmMainFileSize, consts.goArgv, this.options.resPrefix + "workers/PandoraPay-webworker-wasm.js", (status)=>{
            console.log("Main status:", status)
            this.progressStatus = status
          }, async ()=>{

            await PandoraPay.helpers.helloPandora()
            this.progressStatus = "WASM is working!"

            if (this.options.intro.loadWasmHelper){
              let helperPromiseResolved = false
              global.PandoraPayHelperPromise = new Promise((resolver)=>{

                //for debugging only
                //return resolver(true)

                global.PandoraPayHelperLoader = async () => {

                  if (helperPromiseResolved) return //already resolved
                  helperPromiseResolved = true

                  const wasmHelperSri = global.SRI_WASM_HELPER || ''
                  const wasmHelperFileSize = global.SIZE_WASM_HELPER || 0

                  const integrationHelper = new WasmWebworkerIntegration("PandoraPayHelper", this.options.resPrefix +"wasm/PandoraPay-wallet-helper.wasm?"+wasmHelperSri, wasmHelperSri, wasmHelperFileSize, consts.goArgv, this.options.resPrefix + "workers/PandoraPay-webworker-wasm.js", (status)=>{
                    console.log("Helper status:", status)
                  }, async ()=>{

                    let promiseDecoderResolve, promiseDecoderReject
                    global.PandoraPayHelper.decoderPromise = new Promise((resolve, reject)=>{
                      promiseDecoderResolve = resolve
                      promiseDecoderReject = reject
                    })

                    await PandoraPayHelper.helloPandoraHelper()
                    console.log("Helper WASM is working")

                    resolver(true)

                    const balanceDecryptorTableSize = Number.parseInt( localStorage.getItem('balanceDecryptorTableSize') || '18');

                    const promise = PandoraPayHelper.wallet.initializeBalanceDecryptor( MyTextEncode( JSONStringify( { tableSize: 1 << balanceDecryptorTableSize } )) , status =>{
                      if (PandoraPayHelper.balanceDecoderCallback) PandoraPayHelper.balanceDecoderCallback(status)
                    })

                    promise
                        .then( answ => promiseDecoderResolve(answ) )
                        .catch( err => promiseDecoderReject(err) )

                    await promise
                  } )


                  const data = await integrationHelper.downloadWasm(status => console.log( "helper:", status ) )
                  await integrationHelper.createWorker()
                  integrationHelper.initialize( data )
                }

              })


            }

            await PandoraPayWallet.loadApp()

          })

          const data = await integration.downloadWasm(status => this.progressStatus = status )

          this.progressStatus = "Web Worker created"
          await integration.createWorker()

          this.progressStatus = "WASM instantiating..."
          integration.initialize( data )

        }catch(err){
          this.error = err.toString()
        }

      }
    },

    //based on https://codepen.io/alexrmota/pen/NWqwGyJ

}
</script>

<style scoped>

    h1{
        font-size: 30px;
        padding-top:20px;
        color: #16b6dc;
    }

    .logo{
        max-width: 60px;
        position: absolute;
        margin-top: 95px;
        margin-left: 67px;
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
