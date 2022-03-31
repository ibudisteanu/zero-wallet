import Decimal from "decimal.js";
import consts from "../../../../consts/consts";

export default {

    setAssetsInfo(state, {newAssetsInfo, start, end} ){

        let viewPosition = {start, end}

        if (state.viewPosition)
            viewPosition = state.viewPosition

        for (const height in newAssetsInfo)
            state.listByHeight[height] = newAssetsInfo[height]

        for (const heightStr in state.listByHeight){
            const height = new Decimal(heightStr)
            if ( height.gt( viewPosition.end ) || height.lt( viewPosition.start.minus(consts.assetsInfoPagination) ) )
                delete(state.listByHeight[height])
        }

    },

    setAssetsInfoViewPosition(state, viewPosition ){
        state.viewPosition = viewPosition
    },

    setAssetsInfoAllowDownload(state, allowDownload){
        state.allowDownload = allowDownload
    }

}
