const wasmSri = (typeof DEV_SERVER === "undefined") ? require('../dist/sri/build-main').default.wasm : undefined

const PandoraStorage = require('../helpers/storage/pandora-storage')
const GoWebworker = require('../helpers/go-webworker')
GoWebworker("PandoraPay", wasmSri)

PandoraStorage.exportStorage()

