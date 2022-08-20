require('../dist/wasm_exec.js')

const Helper = require("../helpers/helper");

const sha256 = (typeof DEV_SERVER === "undefined") ? require('js-sha256') : undefined;

module.exports = function (wasmGlobalObjectName, wasmSri){

    self.onmessage = async function(event) {

        if (event.type === "message"){

            const data = Helper.FixObject( self, event.data )

            let steps = 0
            let stepsTotal = 5

            if (data.type === "initialize"){

                self.postMessage({ type: "initialize-answer",  status: `${Math.floor(steps/stepsTotal*100)}% WebWorker initializing...`, })
                steps++

                if (wasmSri && sha256){
                    const hash = sha256.create()
                    hash.update(data.data);
                    if (hash.hex() !== wasmSri)
                        return self.postMessage({ type: "initialize-answer",  status: `Sri mismatch. Aborted.`})
                    self.postMessage({ type: "initialize-answer",  status: `${Math.floor(steps/stepsTotal*100)}% WASM hash match!`, })
                }else{
                    self.postMessage({ type: "initialize-answer",  status: `${Math.floor(steps/stepsTotal*100)}% WASM hash skipped`, })
                }

                steps++

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

                const transferable = []
                const clone = Helper.ProcessObject( global[wasmGlobalObjectName], transferable )

                self.postMessage({ type: "initialize-done", clone, }, transferable)
                steps++

            }

            return Helper.OnMessage(self, data)
        }

    }

}
