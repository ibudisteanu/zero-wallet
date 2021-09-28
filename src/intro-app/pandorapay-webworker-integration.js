import consts from "../../consts/consts";

const PandoraPayWorkerAnswers = {}
const PandoraPayWorkerCallbacks = {}

export default class PandorapayWebworkerIntegration{

    constructor() {

        this.worker = new Worker(PandoraPayWalletOptions.resPrefix+"PandoraPay-webworker.js");

        this.worker.onmessage = async (event) => {

            if (event.type === "message") {

                let data = event.data
                //console.log(data)

                if (data.type === "initialize-answer") {
                    if (this.initializeStatusEvent) this.initializeStatusEvent(data.status)
                }
                else if (data.type === "initialize-done") {

                    const {PandoraPayClone} = data

                    global.PandoraPay = {}

                    this.fixPandoraPay(PandoraPayClone, PandoraPay)

                    await PandoraPay.helpers.helloPandora()

                    if (this.initializeStatusEvent) this.initializeStatusEvent("PandoraPay WASM is working!")

                    PandoraPayWallet.loadWallet()

                } else if (data.type === "callPandoraPayFunctionAnswer") {
                    const {resolve, reject} = PandoraPayWorkerAnswers[data.id]

                    if (data.answer)
                        resolve(data.answer)
                    else if (data.error)
                        reject(data.error)

                    delete PandoraPayWorkerAnswers[data.id]
                } else if (data.type === "PandoraPayFunctionCallback") {
                    const cb = PandoraPayWorkerCallbacks[data.id]
                    cb(...data.data)
                }

            }

        }

    }

    initialize(data){
        this.worker.postMessage({
            type: "initialize",
            goArgv: consts.goArgv,
            data: data,
        });
    }

    //let's fix the functions
    fixPandoraPay(src, dst) {

        for (const key in src) {

            if (typeof src[key] === "object" && src[key].__type === "function" && src[key].__id) {

                dst[key] =  (...args) => {

                    const id = Math.random().toString() + Math.random().toString()

                    const promise = new Promise((resolve, reject) => {
                        PandoraPayWorkerAnswers[id] = {resolve, reject}
                    })

                    let newArguments = [...args]
                    let deleteCallbacks = []
                    for (let i=0; i < newArguments.length; i++){
                        if (typeof newArguments[i] === "function"){

                            const callbackId = Math.random().toString() + Math.random().toString()
                            PandoraPayWorkerCallbacks[callbackId] = newArguments[i]
                            newArguments[i] = {
                                __type: "callback",
                                __id: callbackId,
                            }

                            deleteCallbacks.push(callbackId)
                        }
                    }

                    try {
                        this.worker.postMessage({
                            type: "callPandoraPayFunction",
                            id: src[key].__id,
                            answerId: id,
                            arguments: newArguments,
                        })
                    } catch (err) {
                        console.error("error postMessage", err)
                    }

                    // promise.then(function() {
                    //     for (const key of deleteCallbacks)
                    //         delete(PandoraPayWorkerCallbacks[key])
                    // }).catch(function() {
                    //     for (const key of deleteCallbacks)
                    //         delete(PandoraPayWorkerCallbacks[key])
                    // });

                    return promise
                }

            } else if (typeof src[key] === "object") {
                dst[key] = {}
                this.fixPandoraPay(src[key], dst[key])
            } else
                dst[key] = src[key]

        }
    }

}
