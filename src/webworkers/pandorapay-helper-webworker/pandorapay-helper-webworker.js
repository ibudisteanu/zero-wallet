const wasmSri = (typeof DEV_SERVER === "undefined") ? require('../dist/sri/build-helper').default.wasm : undefined

const GoWebworker = require('../helpers/go-webworker')
GoWebworker("PandoraPayHelper", wasmSri )
