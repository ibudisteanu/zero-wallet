const level = require('level');
const fs = require('fs')

module.exports = class NodeStorage {

    constructor(name) {

        if (!fs.existsSync(name))
            fs.mkdirSync(name);

        this._db = level(name);
    }

    static supported(){
        return {
            result: true,
            type: "indexdb",
        }
    }

    clear(){
        return this._db.clear()
    }

    async removeItem(key) {
        return this._db.del(key)
    }

    async setItem(key, value) {
        return this._db.put(key, value)
    }

    async getItem(key) {
        return this._db.get(key);
    }

}
