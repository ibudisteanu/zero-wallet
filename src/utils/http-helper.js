const fetch = BROWSER ? window.fetch : require('node-fetch');

class HttpHelper {

    async get(address, params = {}, timeout = 20000){

        const query = Object.keys(params)
                .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&');

        const out = await fetch(`${address}${params ? '?' + query: ''}`)

        const result = await out.text()

        if (!out.ok)
            throw `${out.statusText} : ${result}`

        return JSONParse( result )
    }

    async post(address, body, timeout = 20000){
        const out = await fetch(address, { method: 'POST',
            body: JSONStringify(body),
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            timeout,
        } )
        const result = await out.text()

        if (!out.ok)
            throw `${out.statusText} : ${result}`

        return JSONParse( result )
    }

}

export default new HttpHelper();
