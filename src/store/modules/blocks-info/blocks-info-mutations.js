import Decimal from "decimal.js";
import consts from "../../../../consts/consts";

export default {

    setBlocksInfo(state, {newBlocksInfo, start, end } ){

        let viewPosition = {start, end}
        if (state.viewPosition)
            viewPosition = state.viewPosition

        for (const height in newBlocksInfo)
            state.listByHeight[height] = newBlocksInfo[height]

        for (const heightStr in state.listByHeight){
            const height = new Decimal(heightStr)
            if ( height.gt( viewPosition.end ) || height.lt( viewPosition.start.minus(consts.blocksInfoPagination) ) )
                delete(state.listByHeight[height])
        }

    },

    setBlocksInfoViewPosition(state, viewPosition ){
        state.viewPosition = viewPosition
    },

    setBlocksInfoAllowDownload(state, allowDownload){
        state.allowDownload = allowDownload
    }

}
