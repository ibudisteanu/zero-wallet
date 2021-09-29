const request = require('request-promise-native');

class HttpHelper {

    async get(address, body = {}, timeout = 20000){
        return request.get(address, {
            ...body,
            timeout,
        } )
    }

    async post(address, body, timeout = 20000){
        return request.post(address, {
            form: body,
            timeout,
        } )
    }

}

export default new HttpHelper();
