import Vue from 'vue';

function getTypeName(type){
    return type === 0 ? 'buy' : 'sell';
}

export default {

    setExchangeOffersCount(context, { type, count }) {

        const typeName = getTypeName(type);
        const object = {...context[typeName]};

        object.count = count;

        Vue.set(context, typeName, object );
    },

    setExchangeOffersIds(context, { type, offers, next, clear}) {

        const typeName = getTypeName(type);
        const object = {...context[typeName]};

        if (clear === true) object.offers = {};

        for (const key in offers)
            object.offers[key] = true;

        object.next = next;

        Vue.set(context, typeName, object );
    },

    setExchangeOffers(context, { offers }) {

        for (const key in offers )
            Vue.set(context.list, offers[key].type +'_'+ offers[key].id, offers[key]) ;


    }

}

