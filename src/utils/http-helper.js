const fetch = BROWSER ? window.fetch : require('node-fetch');

class HttpHelper {

    async get(address, params = {}, timeout = 20000){

        const query = Object.keys(params)
                .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&');

        const out = await fetch(`${address}${params ? '?' + query: ''}`)
        return JSONParse( await out.text() )
    }

    async post(address, body, timeout = 20000){
        const out = await fetch(address, { method: 'POST',
            body: JSONStringify(body),
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            timeout,
        } )
        return JSONParse( await out.text())
    }

}

export default new HttpHelper();
