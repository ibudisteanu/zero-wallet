import Decimal from "decimal.js";

class UtilsHelper{

    sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    getPage(pageParam){
        try{
            return new Decimal(pageParam)
        }catch(err){
        }
        return null
    }

}

export default new UtilsHelper()
