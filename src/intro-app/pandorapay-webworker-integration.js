import consts from "consts/consts";
import Helper from "src/webworkers/helpers/helper"

export default class PandorapayWebworkerIntegration{

    constructor(name, wasmFileName, workerFileName, initializeStatusEvent, initializedEvent) {
        if (!name) throw "name was not defined"
        this.name = name
        this.wasmFileName = wasmFileName
        this.workerFileName = workerFileName

        this.initializeStatusEvent = initializeStatusEvent || function () {}
        this.initializedEvent = initializedEvent || function (){}
    }

    async downloadWasm(progressStatusCallback){

        const response = await fetch(PandoraPayWalletOptions.resPrefix+this.wasmFileName, {
            headers: {
                'accept-encoding': 'deflate, gzip, br',
            }
        })

        if (!response.ok) throw response.status+' '+response.statusText
        if (!response.body) throw 'ReadableStream not yet supported in this browser.'

        // to access headers, server must send CORS header "Access-Control-Expose-Headers: content-encoding, content-length x-file-size"
        // server must send custom x-file-size header if gzip or other content-encoding is used
        const contentEncoding = response.headers.get('content-encoding');
        let contentLength = response.headers.get( contentEncoding ? 'x-file-size' : 'content-length');
        if (contentLength === null && contentEncoding) {
            console.error('Response size header unavailable for encoded');
            contentLength = response.headers.get('content-length');
        }

        if (contentLength === null)
            contentLength = 5*1024*1024

        const total = parseInt(contentLength, 10);
        let loaded = 0;

        return new Response(
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

                            if (loaded - lastTransferred > 20240) {
                                lastTransferred = loaded
                                progressStatusCallback(loaded, total)
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
        );
    }

    createWorker(){

        this.worker = new Worker(PandoraPayWalletOptions.resPrefix+this.workerFileName);

        this.worker.onmessage = async (event) => {

            if (event.type === "message") {

                let data = event.data
                //console.log(data)

                if (data.type === "initialize-answer") {
                    this.initializeStatusEvent(data.status)
                }
                else if (data.type === "initialize-done") {

                    const {PandoraPayClone} = data

                    this.fixInstanceObject(PandoraPayClone)

                    this.initializedEvent()
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

    fixInstanceObject(src){
        const dst = Helper.ProcessObject(src, [] )
        global[this.name] = Helper.FixObject(this.worker, dst)
    }

}