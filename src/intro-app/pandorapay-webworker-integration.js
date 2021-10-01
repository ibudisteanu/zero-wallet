import consts from "consts/consts";
import Helper from "src/webworkers/pandorapay-webworker/helper"

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

                    this.fixPandoraPay(PandoraPayClone)

                    await PandoraPay.helpers.helloPandora()

                    if (this.initializeStatusEvent) this.initializeStatusEvent("PandoraPay WASM is working!")

                    PandoraPayWallet.loadWallet()

                }

                return Helper.OnMessage(this.worker, data)
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

    fixPandoraPay(src){
        const dst = Helper.ProcessObject(src, [] )
        global.PandoraPay = Helper.FixObject(this.worker, dst)
    }

}