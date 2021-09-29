const Storage = require("./storage")

class PandoraStorage {

    constructor() {
        this._stores = {}
    }

    createStore(name){
        try{
            const store = new Storage(name)
            this._stores[name] = store
            return store
        }catch(err){
            console.error(err)
            return null
        }
    }

}

module.exports = {
    exportStorage: () => {
        global.PandoraStorage = new PandoraStorage()
    }
}
