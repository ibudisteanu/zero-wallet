import Vue from "vue";

export default {

    setTokenInfo(context, tokenInfo ){
        Vue.set(context.list, tokenInfo.hash, tokenInfo)
    }

}
