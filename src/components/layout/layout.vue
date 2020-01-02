<template>

    <div>

        <left-sidebar />

        <div class="layout">

            <layout-header > </layout-header>

            <slot/>

            <notifications position="bottom left" />
            <loading-modal />

            <layout-footer> </layout-footer>

        </div>
    </div>

</template>

<script>

require('./common.css');

import LayoutHeader from "./header/layout-header.vue";
import LayoutFooter from "./footer/layout-footer.vue";
import LoadingModal from "./modals/loading.modal"
import LeftSidebar from "./left-sidebar/left-sidebar"

export default {

    components: { LeftSidebar, LayoutHeader, LayoutFooter, LoadingModal}

}

</script>


<style scoped>

    .layout {

    }


</style>