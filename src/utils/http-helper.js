const fetch = BROWSER ? window.fetch : require('node-fetch');

class HttpHelper {

    async get(address, params, timeout = 20000){

        let query = ""
        if (params && typeof params === "object" ) query = '?'+Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
        else if (typeof params === "string") query = params

        const out = await fetch(address+query, {
            method: 'GET',
            timeout,
        })

        const result = await out.text()

        if (!out.ok){
            if (result) throw result.trim()
            else throw out.statusText
        }

        return JSONParse( result )
    }

    async post(address, body, timeout = 20000){
        const out = await fetch(address, {
            method: 'POST',
            body: JSONStringify(body),
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            timeout,
        } )
        const result = await out.text()

        if (!out.ok){
            if (result) throw result.trim()
            else throw out.statusText
        }

        return JSONParse( result )
    }

}

export default new HttpHelper();
