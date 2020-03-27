<template>
    <div class="header pd-top-10 pd-bottom-10">

        <div class="container boxed" >

            <div class="row">

                <router-link to="/send/zether/transfer" :class="`${route.indexOf('/send/zether/transfer') === 0 ? 'selected' : ''}`">
                    <i class="fa fa-coins"></i>
                    Transfer Anonymously
                </router-link>

                <router-link to="/send/transparent/withdraw" :class="`${route.indexOf('/send/zether/withdraw') === 0 ? 'selected' : ''}`">
                    <i class="fa fa-donate"></i>
                    Withdraw from Zether
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