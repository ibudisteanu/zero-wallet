import Vue from 'vue';

export default {

    setChatMessagesCount(context, { publicKey1, publicKey2, count } ){

        Vue.set(context.count, publicKey1+":"+publicKey2, count );

    },


}