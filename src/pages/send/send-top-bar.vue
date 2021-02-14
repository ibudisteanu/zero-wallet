<template>
    <div class="topbar">
        <div class="header pd-top-10 pd-bottom-10">

            <div class="container boxed" >

                <div class="row">

                    <router-link to="/send/transparent/transfer" :class="`${route.indexOf('/send/transparent/transfer') === 0 ? 'selected' : ''}`">
                        <i class="fa fa-coins"></i>
                        Transfer Transparently
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
