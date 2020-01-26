import Vue from 'vue';

function getTypeName(type){
    return type === 0 ? 'buy' : 'sell';
}

export default {

    setExchangeOffersCount(context, { type, count }) {

        const typeName = getTypeName(type);

        const object = {...context.offers[typeName]};
        object.pendingCount = count;

        Vue.set(context.offers, typeName, object );
    },

    setExchangeOffers(context, { type, count }) {

        const typeName = getTypeName(type);

        const object = {...context.offers[typeName]};
        object.pendingCount = count;

        Vue.set(context.offers, typeName, object );
    },

}

