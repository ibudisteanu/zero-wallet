<template>
    <div class="header pd-top-10 pd-bottom-10">

        <div class="boxed" >

            <div class="row">

                <router-link to="/chat/buy" :class="`${route.indexOf('/chat') === 0 ? 'selected' : ''}`">
                    <i class="fa fa-inbox"></i>
                    Inbox
                </router-link>

                <span :class="`${route.indexOf('/chat/message') === 0 ? 'selected' : ''}`">
                    <i class="fa fa-comment-dots"></i>
                    Private Chat
                </span>


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
        display: grid;
        grid-template-columns: 100px 150px;
        align-items: center;
    }

    .row a{
        color: black;
        align-items: center;
    }

    .row a.selected{
        color: #6c6ce0;
    }

</style>