require('./wasm_exec.js')
const PandoraStorage = require('./storage/pandora-storage')

PandoraStorage.exportStorage()

const PandoraPayFunctions = {}

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

            const PandoraPayClone = {}
            clonePandoraPay(PandoraPay, PandoraPayClone)

            self.postMessage({ type: "initialize-done", PandoraPayClone, })

        } else if (data.type === "callPandoraPayFunction"){

            const cb = PandoraPayFunctions[data.id]

            let newArguments = data.arguments
            for (let i=0; i < newArguments.length; i++){
                if ( newArguments[i] instanceof ArrayBuffer){
                    newArguments[i] = new Uint8Array(newArguments[i])
                }else if (typeof newArguments[i] === "object" && newArguments[i] != null && newArguments[i].__type === "callback" && newArguments[i].__id){
                    let callbackId = newArguments[i].__id
                    newArguments[i] = function (...args){
                        self.postMessage({ type: "PandoraPayFunctionCallback", id:callbackId, data: args } )
                    }
                }
            }

            let answer = await cb(...newArguments)

            if (answer instanceof Error)
                self.postMessage({type: "callPandoraPayFunctionAnswer", id: data.answerId, error: answer.message })
            else{

                const transfers = []
                if (answer instanceof Uint8Array) {
                    answer = answer.buffer
                    transfers.push(answer)
                }

                self.postMessage({type: "callPandoraPayFunctionAnswer", id: data.answerId, answer: answer }, transfers)
            }

        }

    }

}


function clonePandoraPay(src, dst ){
    for (const key in src ){

        if (typeof src[key] === "function"){

            const id = generateRandomId()
            PandoraPayFunctions[id] = src[key]

            dst[key] = {
                __type: "function",
                __id: id,
            }

        }else if (typeof src[key] === "object"){
            dst[key] = {}
            clonePandoraPay(src[key], dst[key])
        }else
            dst[key] = src[key]

    }
}

function generateRandomId( ){
    return Math.random().toString()+Math.random().toString()
}