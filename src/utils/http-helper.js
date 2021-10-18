const fetch = BROWSER ? window.fetch : require('node-fetch');

class HttpHelper {

    async get(address, params = {}, timeout = 20000){

        let query = Object.keys(params)
                .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&');

        const out = await fetch(address+'?' +query)
        return out.json()
    }

    async post(address, body, timeout = 20000){
        const out = await fetch(address, { method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            timeout,
        } )
        return out.json()
    }

}

export default new HttpHelper();
