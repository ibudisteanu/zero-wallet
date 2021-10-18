const MAX_CACHE = 1000

class Identicons {

    constructor() {
        this.list = []
        this.map = {}
    }

    async getIdenticon( publicKey, size = 64 ){

        const key = `${size}::${publicKey}`

        if ( typeof size === "string") size = Number.parseInt(size)

        const found = this.map[key]
        if (found)
            return found.identicon;

        if (this.list.length === MAX_CACHE){
            const item = this.list[0]
            this.list.slice(0,1)
            delete this.map[item.key]
        }

        let resolve
        const promise = new Promise((resolver)=>{
            resolve = resolver
        })

        const item = {
            key: key,
            identicon: promise
        }
        this.map[key] = item
        this.list.push(item)

        const data = await PandoraPay.helpers.getIdenticon( publicKey, size, size )
        const blob = new Blob( [ data ],  { type: 'image/png' } );
        item.identicon = URL.createObjectURL(blob)

        resolve( item.identicon )

        return item.identicon

    }

}

export default new Identicons()
