require('../dist/wasm_exec.js')

const Helper = require("../helpers/helper");
const PandoraStorage = require("./storage/pandora-storage");

module.exports = function (){

    self.onmessage = async function(event) {

        if (event.type === "message"){

            const data = Helper.FixObject( self, event.data )

            let steps = 0
            let stepsTotal = 5

            if (data.type === "initialize"){

                self.postMessage({ type: "initialize-answer",  status: `${Math.floor(steps/stepsTotal*100)}% WebWorker initializing...`, })
                steps++

                //here we can initialise various libraries used by different wasm modules.
                if (data.name === "PandoraPay"){
                    PandoraStorage.exportStorage()
                }
                self.postMessage({ type: "initialize-answer",  status: `${Math.floor(steps/stepsTotal*100)}% WebWorker libraries initialised...`, })
                steps++

                global.WASMLoaded = ()=>{
                    const transferable = []
                    const clone = Helper.ProcessObject( global[data.name], transferable )

                    self.postMessage({ type: "initialize-done", clone, }, transferable)
                    steps++
                }

                const go = new Go();
                go.argv = data.goArgv

                self.postMessage({ type: "initialize-answer", status: `${Math.floor(steps/stepsTotal*100)}% WASM creating...`, })
                steps++

                const result = await WebAssembly.instantiate( data.data, go.importObject)

                self.postMessage({ type: "initialize-answer", status: `${Math.floor(steps/stepsTotal*100)}% WASM executing...`, })
                steps++

                go.run(result.instance).catch( e => {
                    self.postMessage({ type: "initialize-answer", status: `WASM execution raised an error ${e.toString()}`, })
                })

                self.postMessage({ type: "initialize-answer", status: `${Math.floor(steps/stepsTotal*100)}% WASM executed`, })
                steps++



            }

            return Helper.OnMessage(self, data, false )
        }

    }

}
