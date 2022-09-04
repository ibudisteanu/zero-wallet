import Helper from "src/webworkers/helpers/helper"

export default class WasmWebworkerIntegration {

    constructor(name, wasmFileName, wasmSri, goArgv, workerFileName, initializeStatusEvent, initializedEvent) {
        if (!name) throw "name was not defined"

        this.name = name
        this.goArgv = goArgv
        this.wasmFileName = wasmFileName
        this.wasmSri = wasmSri
        this.workerFileName = workerFileName

        this.initializeStatusEvent = initializeStatusEvent || function () {}
        this.initializedEvent = initializedEvent || function (){}
    }

    newWorker (blob){

        // Build a worker from an anonymous function body
        const blobURL = URL.createObjectURL(blob);

        const worker = new Worker(blobURL);

        // Won't be needing this anymore
        URL.revokeObjectURL(blobURL);

        return worker;
    }

    async downloadWasm( progressStatusCallback){
        return this.download(this.wasmFileName, this.wasmSri, progressStatusCallback)
    }

    async download(filename, sri, progressStatusCallback){

        const response = await fetch(filename, {
            headers: {
                'accept-encoding': 'deflate, gzip, br',
            },
            integrity: sri,
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
                                if (progressStatusCallback) progressStatusCallback(loaded, total)
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

    async createWorker(){

        const code = await this.download(this.workerFileName+"?"+global.SRI_WEB_WORKER_WASM, global.SRI_WEB_WORKER_WASM, null )

        this.worker = this.newWorker( await code.blob() );

        this.worker.onmessage = async (event) => {

            if (event.type === "message") {

                let data = event.data
                //console.log(data)

                if (data.type === "initialize-answer") {
                    this.initializeStatusEvent(data.status)
                }
                else if (data.type === "initialize-done") {

                    const {clone} = data

                    this.fixInstanceObject(clone)

                    this.initializedEvent()
                }

                return Helper.OnMessage(this.worker, data, true )
            }

        }

    }

    initialize(data){
        let transferable = []

        const final = Helper.ProcessObject( {
            type: "initialize",
            goArgv: this.goArgv,
            data: data,
            name: this.name,
        }, transferable)

        this.worker.postMessage(final, transferable);
    }

    fixInstanceObject(src){
        const dst = Helper.ProcessObject(src, [] )
        global[this.name] = Helper.FixObject(this.worker, dst)
    }

}