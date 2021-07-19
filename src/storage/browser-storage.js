const localforage = require('localforage');

module.exports = class BrowserStorage {

    constructor(name) {

        this._store = localforage.createInstance({
            name: name,
            storeName: name,
        })
    }

    static supported(){
        const indexdb = localforage.supports(localforage.INDEXEDDB);
        if (indexdb) return {
            result: true,
            type: "indexdb",
        };

        const websql = localforage.supports(localforage.WEBSQL);
        if (websql) return {
            result: true,
            type: "websql",
        }

        const localstorage = localforage.supports(localforage.LOCALSTORAGE);
        if (localstorage) return {
            result: true,
            type: "localstorage",
        }

        return {
            result: false,
        }
    }

    clear(){
        return this._store.clear()
    }

    async removeItem(key) {
        return this._store.removeItem(key)
    }

    async setItem(key, value) {
        return this._store.setItem(key, value)
    }

    async getItem(key) {
        return this._store.getItem(key);
    }

}
