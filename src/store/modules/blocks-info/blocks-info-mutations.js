import Vue from 'vue';

export default {

    setBlocksInfo(state, listByHeights ){
        state.listByHeight = listByHeights
    },

    setBlocksInfoViewPosition(state, {starting, ending}){
        state.viewPosition = {
            starting,
            ending
        }
    }

}
