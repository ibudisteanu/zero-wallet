<template>
    <div class="header pd-top-10 pd-bottom-10">

        <div class="container boxed" >

            <div class="row">

                <router-link to="/exchange/buy" :class="`${route.indexOf('/exchange/buy') === 0 ? 'selected' : ''}`">
                    <i class="fa fa-coins"></i>
                    Buy
                </router-link>

                <router-link to="/exchange/sell" :class="`${route.indexOf('/exchange/sell') === 0 ? 'selected' : ''}`">
                    <i class="fa fa-donate"></i>
                    Sell
                </router-link>

                <router-link to="/exchange/portfolio" :class="`${route.indexOf('/exchange/portfolio') === 0 ? 'selected' : ''}`">
                    <i class="fa fa-money-check-alt"></i>
                    Portfolio
                </router-link>

            </div>

        </div>

    </div>
</template>

<script>
export default {

    computed:{

        route(){
            return this.$router.currentRoute.path;
        }

    }

}
</script>

<style scoped>
    .header {
        width: 100%;
        background-color: #EEEEEE;
    }

    .row{
        font-size: 15px;
        display: inline-block;
    }

    .row a{
        color: black;
        margin-right: 15px;
    }

    .row a.selected{
        color: #6c6ce0;
    }


</style>