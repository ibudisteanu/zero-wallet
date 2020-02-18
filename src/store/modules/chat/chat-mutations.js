import Vue from 'vue';

export default {

    setChatInfo(context, data){

        context.index = data.index;
        context.timestamp = data.timestamp;
        context.target = data.target;

    },

    setChatStatus(context, status){
        context.status = status;
    },


}