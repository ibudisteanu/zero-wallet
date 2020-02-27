const axios = require('axios');

class HttpHelper {

    async get(address, body, json = true, timeout = 20000){

        const out = await axios.get(address, body);

        if (out) return out.data;

    }

    async post(address, body, json = true, timeout = 20000){

        const out = await axios.post(address, body);
        if (out) return out.data;
    }

}

export default new HttpHelper();