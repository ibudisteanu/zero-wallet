const MAX_CACHE = 200

class Identicons {

    constructor() {
        this.list = []
        this.map = {}
    }

    async getIdenticon(key){

        const found = this.map[key]
        if (found){
            return found.identicon;
        }

        if (this.list.length === MAX_CACHE){
            const item = this.list[0]
            this.list.splice(0,1)
            delete this.map[item.key]
        }

        const data = await PandoraPay.helpers.getIdenticon( key, 64, 64)

        const blob = new Blob( [ data ],  { type: 'image/png' } );

        const item = {
            key: key,
            identicon: URL.createObjectURL(blob),
        }

        this.map[key] = item;
        this.list.push(item)

        return item.identicon

    }

}

export default new Identicons()
