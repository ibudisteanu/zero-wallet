const Callbacks = {}

async function OnMessage(worker, data ){

    if (data.type === "callback"){

        const cb = Callbacks[data.id]

        //console.log("OnMessage1", cb, data.arguments, typeof data.arguments )

        const transferable = []
        let out = ProcessObject( data.arguments, transferable )
        out = FixObject(worker, out )

        //console.log("OnMessage2", cb, data.arguments, out )

        let result, err

        try{
            if (data.isArray)
                result = await cb(out)
            else
                result = await cb(...out)
        }catch(err){
            result = err
        }

        //console.log(result, err)

        if (data.answerId){
            let isArray = true
            if ( !Array.isArray(result) ) {
                result = [result]
                isArray = false
            }

            result = ProcessObject(result, [] )
            worker.postMessage({type: "callback", id: data.answerId, arguments: [...result], isArray })
        }

    }

}
function ProcessObject(src, transferable = []){

    let dst = src

    if ( src instanceof Error)
        dst = {
            __type: "error",
            __message: src.message,
        }
    else if ( src === null || src === undefined) { }
    else if ( src instanceof ArrayBuffer )
        transferable.push(dst)
    else if ( src instanceof Uint8Array ) {
        dst = src.buffer
        transferable.push(dst)
    } else if (typeof src === "function"){

        const id = GenerateRandomId()
        Callbacks[id] = src

        dst = {
            __type: "callback",
            __id: id,
        }

    } else if (Array.isArray(src) ){
        dst = []
        for (let i=0; i < src.length; i++)
            dst.push(  ProcessObject(src[i], transferable) )
    } else if ( typeof src === "object" ){
        dst = {}
        for (const key in src )
            dst[key] = ProcessObject(src[key], transferable)

    }

    return dst
}

function FixObject(worker, src){

    let dst = src

    if ( src instanceof Error  || src === null || src === undefined) { }
    else if ( src instanceof ArrayBuffer ) dst = new Uint8Array(src)
    else if (src instanceof Uint8Array ){ }
    else if (typeof src === "object" && src.__type === "error" ) {
        dst = new Error(src.message)
    } else if (typeof src === "object" && src.__type === "callback" && src.__id ){

        let callbackId = src.__id

        dst = function (...args) {

            const id = GenerateRandomId()

            const promiseControl = {}
            const promise = new Promise((resolve, reject)=>{
                promiseControl.resolve = resolve
                promiseControl.reject = reject
            })

            Callbacks[id] = (...args)=>{

                if (args.length === 1 && args[0] instanceof Error){
                    promiseControl.reject(args[0])
                }else {
                    promiseControl.resolve(...args)
                }

                delete Callbacks[id]
            }

            let transferable = []
            const newArgs = ProcessObject( [...args], transferable)

            worker.postMessage({
                type: "callback",
                id: callbackId,
                answerId: id,
                arguments: newArgs,
            }, transferable);

            return promise
        }

    }else if (Array.isArray(src) ){
        dst = []
        for (let i=0; i < src.length; i++)
            dst.push( FixObject(worker, src[i]) )
    } else if ( typeof dst === "object" ){

        dst = {}
        for (const key in src )
            dst[key] = FixObject(worker, src[key])

    }

    return dst
}

function GenerateRandomId( ){
    return Math.random().toString()+Math.random().toString()
}

module.exports ={
    OnMessage,
    ProcessObject,
    FixObject,
    Callbacks,
}