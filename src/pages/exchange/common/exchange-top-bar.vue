<template>
    <div class="header pd-top-10 pd-bottom-10">

        <div class="boxed" >

            <div class="row">

                <router-link to="/exchange/buy">
                    <i class="fa fa-coins"></i>
                    Buy
                </router-link>

                <router-link to="/exchange/sell">
                    <i class="fa fa-donate"></i>
                    Sell
                </router-link>

                <router-link to="/exchange/portfolio">
                    <i class="fa fa-money-check-alt"></i>
                    Portfolio
                </router-link>

            </div>

        </div>

    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
    .header {
        width: 100%;
        background-color: #EEEEEE;
    }

    .row{
        display: grid;
        grid-template-columns: 80px 80px 80px;
        align-items: center;
    }

    .row a{
        color: black;
        align-items: center;
    }

</style>