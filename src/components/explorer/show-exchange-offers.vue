<template>
    <div>

        <div class="table">
            <div class="table-header table-row">
                <span>Title</span>
                <span>Date</span>
                <span>Amount min-max</span>
                <span>Payments</span>
                <span>Feedback</span>
                <span>Trader</span>
            </div>
            <div v-for="offer in offers" class="table-row"  >

                <span class="wordwrap">{{offer.title}}</span>
                <span>{{offer.epoch}}</span>
                <span>{{offer.amountMin }} - {{offer.amountMax}} {{offer.tokenCurrency.toString("hex")}}</span>
                <span>{{offer.payments.map (it => it.name ).join(' ')}}</span>
                <span>na</span>
                <span>
                    <account-identicon :publicKey="offer.publicKey" size="20" outer-size="7" />
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
        grid-template-columns: 2fr 60px 130px 1fr 80px 60px ;
    }

</style>