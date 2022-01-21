import Vue from "vue";

export default {

    setAssetsInfo(state, listByHeights ){
        state.listByHeight = listByHeights
    },

    setAssetsInfoAllowDownload(state, allowDownload){
        state.allowDownload = allowDownload
    }

}
