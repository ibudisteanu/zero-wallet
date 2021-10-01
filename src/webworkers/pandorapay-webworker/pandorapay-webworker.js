require('./wasm_exec.js')
const PandoraStorage = require('./storage/pandora-storage')
const Helper = require('./helper')
const {header} = require("request/lib/hawk");

PandoraStorage.exportStorage()

self.onmessage = async function(event) {

    if (event.type === "message"){

        const data = event.data

        if (data.type === "initialize"){

            self.postMessage({ type: "initialize-answer",  status: "WebWorker initializing...", })

            const go = new Go();
            go.argv = data.goArgv

            self.postMessage({ type: "initialize-answer",  status: "GO instance created", })

            self.postMessage({ type: "initialize-answer", status: "PandoraPay WASM executing...", })

            const result = await WebAssembly.instantiate( data.data, go.importObject)
            go.run(result.instance)

            self.postMessage({ type: "initialize-answer", status: "PandoraPay WASM executed", })

            const transferable = []
            const PandoraPayClone = Helper.ProcessObject( PandoraPay, transferable )

            self.postMessage({ type: "initialize-done", PandoraPayClone, }, transferable)

        }

        return Helper.OnMessage(self, data)
    }

}
