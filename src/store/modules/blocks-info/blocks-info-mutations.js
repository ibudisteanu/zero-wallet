import Vue from 'vue';

export default {

    setBlocksInfo(state, listByHeights ){
        state.listByHeight = listByHeights
    },

    setBlocksInfoViewPosition(state, viewPosition ){
        state.viewPosition = viewPosition
    }

}
