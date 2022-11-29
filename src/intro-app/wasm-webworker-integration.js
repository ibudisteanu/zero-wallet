import Helper from "src/webworkers/helpers/helper"
const createHash = require("sha256-uint8array").createHash;

export default class WasmWebworkerIntegration {

    constructor(name, wasmFileName, wasmSri, wasmFileSize, goArgv, workerFileName, initializeStatusEvent, initializedEvent) {
        if (!name) throw "name was not defined"

        this.name = name
        this.goArgv = goArgv
        this.wasmFileName = wasmFileName
        this.wasmSri = wasmSri
        this.workerFileName = workerFileName
        this.wasmFileSize = wasmFileSize

        this.initializeStatusEvent = initializeStatusEvent || function () {}
        this.initializedEvent = initializedEvent || function (){}
    }

    async downloadWasm( progressStatusCallback){

        const wasmFileSize = this.wasmFileSize

        function formatLoadedSize (loaded, total) {
            if (wasmFileSize > 0) {
                const totalStr = total ? `${ (total/1024/1024).toFixed(2)}mb - ` : ''
                return totalStr + `${Math.floor(loaded / wasmFileSize * 10000) / 100}%`
            }
            return `${( loaded / 1024 / 1024 ).toFixed(2)}mb`
        }

        const output = await this.download(this.wasmFileName, this.wasmSri, (loaded, total) => {
            progressStatusCallback("WASM downloading "+ formatLoadedSize(loaded, total) )
        })

        if (!output) throw `Error downloading ${this.wasmFileName}`

        const {serialized, loaded} = output

        progressStatusCallback("WASM processing...")

        return serialized
    }

    async download(filename, sri, progressStatusCallback){

        while(true) {

            try{

                const response = await fetch(filename, {
                    headers: new Headers({
                        'Accept-Encoding': 'br, gzip, compress, deflate',
                    }),
                })

                if (!response.ok) throw response.status+' '+response.statusText
                if (!response.body) throw 'ReadableStream not yet supported in this browser.'

                // to access headers, server must send CORS header "Access-Control-Expose-Headers: content-encoding, content-length x-file-size"
                // server must send custom x-file-size header if gzip or other content-encoding is used
                const contentEncoding = response.headers.get('content-encoding');

                let contentLength = response.headers.get( contentEncoding ? 'x-file-size' : 'content-length');

                if (!contentLength && contentEncoding) {
                    console.error('Response size header unavailable for encoded');
                    contentLength = response.headers.get('content-length');
                }

                if (!contentLength) contentLength = '0'

                const total = parseInt(contentLength, 10)
                let loaded = 0;
                let chunks = []

                const reader = response.body.getReader();

                let lastTransferred = 0
                while (true){

                    const {done, value} = await reader.read()
                    if (done) break

                    loaded += value.byteLength

                    if (loaded - lastTransferred > 25*1024) {
                        lastTransferred = loaded
                        if (progressStatusCallback)
                            progressStatusCallback(loaded, total)
                    }

                    chunks.push(value)
                }

                let serialized = new Uint8Array(loaded)
                let position = 0;
                for(let chunk of chunks) {
                    serialized.set(chunk, position)
                    position += chunk.length;
                }

                if (sri){
                    const hash = createHash().update( serialized ).digest('hex')
                    if (hash !== sri) return null
                }

                return {serialized, loaded}

            }catch(e){
                console.error("error downloading file", filename, e )
            }
        }

    }

    newWorker (blob){

        // Build a worker from an anonymous function body
        const blobURL = URL.createObjectURL(blob);

        const worker = new Worker(blobURL);

        // Won't be needing this anymore
        URL.revokeObjectURL(blobURL);

        return worker;
    }

    async createWorker(){

        const output = await this.download(this.workerFileName+"?"+global.SRI_WEB_WORKER_WASM, global.SRI_WEB_WORKER_WASM, null )
        if (!output) throw `Error downloading worker ${this.workerFileName}`

        const {serialized, loaded} = output
        this.worker = this.newWorker( new Blob([serialized]) );

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
            data,
            name: this.name,
        }, transferable)

        this.worker.postMessage(final, transferable);
    }

    fixInstanceObject(src){
        const dst = Helper.ProcessObject(src, [] )
        global[this.name] = Helper.FixObject(this.worker, dst)
    }

}