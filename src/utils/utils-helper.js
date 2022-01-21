import Decimal from "decimal.js";

class UtilsHelper{

    sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    getPage(pageParam){
        if (pageParam)
            try{
                return new Decimal(pageParam)
            }catch(err){
                this.error = "Invalid page number"
                return null
            }
        return null
    }

}

export default new UtilsHelper()
