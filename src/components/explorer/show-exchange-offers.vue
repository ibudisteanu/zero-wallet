<template>
    <div>

        <div class="table">
            <div class="table-header table-row">
                <span>Title</span>
                <span>Date</span>
                <span>Price</span>
                <span>Amount min-max</span>
                <span>Payments</span>
                <span>Feedback</span>
                <span>Trader</span>
                <span>Chat</span>
            </div>
            <div v-for="(offer, index) in offers" class="table-row"
                 :key="`show-exchange-offers-${index}`">

                <span class="wordwrap">{{offer.title}}</span>
                <span>{{offer.height}}</span>
                <span>${{offer.price}} </span>
                <span>{{offer.amountMin }} - {{offer.amountMax}} </span>
                <span>{{offer.payments.map (it => it.name ).join(' ')}}</span>
                <span>na</span>
                <span>
                    <account-identicon :publicKey="offer.publicKey" size="20" outer-size="7" />
                </span>
                <span>
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