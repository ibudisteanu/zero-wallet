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
            <router-link v-for="offer in offers" class="table-row" >

                <span class="wordwrap">{{offer.title}}</span>
                <span>Date</span>
                <span>Amount min-max</span>
                <span>Payments</span>
                <span>Feedback</span>
                <span>Trader</span>

            </router-link>
        </div>

    </div>
</template>

<script>
export default {

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