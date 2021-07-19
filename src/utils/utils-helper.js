class UtilsHelper{

    sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms))
    }

}

export default new UtilsHelper()
