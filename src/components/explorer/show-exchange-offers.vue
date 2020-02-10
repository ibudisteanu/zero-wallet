<template>
    <div>

        <div class="table">
            <div class="row pd-top-10 pd-bottom-10">
                <span class="col-xs-12 col-sm-2 wordwrap">Title</span>
                <span class="col-xs-4 col-sm-2 wordwrap">Price</span>
                <span class="col-xs-4 col-sm-2 wordwrap">Amount</span>
                <span class="col-xs-4 col-sm-2 wordwrap">Payments</span>
                <span class="col-xs-4 col-sm-2 wordwrap">Feedback</span>
                <span class="col-xs-4 col-sm-1 wordwrap">Trader</span>
                <span class="col-xs-4 col-sm-1 wordwrap">Chat</span>
            </div>
            <div v-for="(offer, index) in offers"
                 :key="`show-exchange-offers-${index}`"
                 class="row pd-top-10 pd-bottom-10">

                <span class="col-xs-12 col-sm-2 wordwrap">{{offer.title}}</span>
                <span class="col-xs-4 col-sm-2 wordwrap">${{offer.price}} </span>
                <span class="col-xs-4 col-sm-2 wordwrap">{{offer.amountMin }} - {{offer.amountMax}} </span>
                <span class="col-xs-4 col-sm-2 wordwrap">{{offer.payments.map (it => it.name ).join(' ')}}</span>
                <span class="col-xs-4 col-sm-2 wordwrap">na</span>
                <span class="col-xs-4 col-sm-1 wordwrap">
                    <account-identicon :publicKey="offer.publicKey" size="20" outer-size="7" />
                </span>
                <span class="col-xs-4 col-sm-1 wordwrap">
                    <router-link :to="`/chat/conversation/${offer.publicKey.toString('hex')}`">
                        <i class="fa fa-comment-dots"></i>
                    </router-link>
                </span>

            </div>
        </div>

    </div>
</template>

<script>
import AccountIdenticon from "src/components/wallet/account/account-identicon"
export default {

    components: {AccountIdenticon},

    props: {
        offers: {},
    }

}
</script>

<style scoped>

    .table-row{
        grid-template-columns: 2fr 60px  100px 130px 1fr 80px 60px 50px ;
    }

    i{
        font-size: 22px;
    }

</style>