import Vue from 'vue';

export default {

    setBlocksInfo(state, {newBlocksInfo, deletedBlocksInfo} ){
        for (const key in newBlocksInfo)
            Vue.set(state.listByHeight, newBlocksInfo[key].height, newBlocksInfo[key]);

        for (const height of deletedBlocksInfo)
            Vue.delete(state.listByHeight, height )
    },

    setBlocksInfoViewPosition(state, {starting, ending}){
        state.viewPosition = {
            starting,
            ending
        }
    }

}
