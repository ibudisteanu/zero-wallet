<template>
    <div class="topbar">
        <div class="header pd-top-10 pd-bottom-10">

            <div class="container boxed" >

                <div class="row">

                    <router-link to="/chat" :class="`${route === '/chat'? 'selected' : ''}`">
                        <i class="fa fa-inbox"></i>
                        Inbox
                    </router-link>

                    <span :class="`${route.indexOf('/chat/conversation') === 0 ? 'selected' : ''}`">
                    <i class="fa fa-comment-dots"></i>
                    Private Chat
                </span>

                    <router-link to="/chat/conversation/start" :class="`${route.indexOf('/chat/conversation/start') === 0 ? 'selected' : ''}`">
                        <i class="fa fa-comment-dots"></i>
                        Start Private Chat
                    </router-link>


                </div>

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
