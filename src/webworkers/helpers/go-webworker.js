require('./wasm_exec.js')

const Helper = require("../helpers/helper");
self.onmessage = async function(event) {

    if (event.type === "message"){

        const data = event.data

        if (data.type === "initialize"){

            self.postMessage({ type: "initialize-answer",  status: "WebWorker initializing...", })

            const go = new Go();
            go.argv = data.goArgv

            self.postMessage({ type: "initialize-answer", status: "WASM creating...", })

            const result = await WebAssembly.instantiate( data.data, go.importObject)

            self.postMessage({ type: "initialize-answer", status: "WASM executing...", })

            go.run(result.instance)

            self.postMessage({ type: "initialize-answer", status: "WASM executed", })

            const transferable = []
            const PandoraPayClone = Helper.ProcessObject( PandoraPay, transferable )

            self.postMessage({ type: "initialize-done", PandoraPayClone, }, transferable)

        }

        return Helper.OnMessage(self, data)
    }

}
