export default {

    setBlocksInfo(state, listByHeights ){
        state.listByHeight = listByHeights
    },

    setBlocksInfoViewPosition(state, viewPosition ){
        state.viewPosition = viewPosition
    },

    setBlocksInfoAllowDownload(state, allowDownload){
        state.allowDownload = allowDownload
    }

}
