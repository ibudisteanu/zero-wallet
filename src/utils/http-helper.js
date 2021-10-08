import fetch from 'node-fetch';

class HttpHelper {

    async get(address, body = {}, timeout = 20000){
        const out = await fetch(address, { method: 'POST',
            body: JSON.stringify(body),
            timeout,
        } )
        return out.json()
    }

    async post(address, body, timeout = 20000){
        const out = await fetch(address, { method: 'POST',
            body: JSON.stringify(body),
            timeout,
        } )
        return out.json()
    }

}

export default new HttpHelper();
