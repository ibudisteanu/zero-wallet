<template>

    <div class="layout">

        <layout-header > </layout-header>

        <slot/>

        <notifications position="bottom left" />
        <loading-modal />

        <layout-footer> </layout-footer>

    </div>

</template>

<script>

require('./common.css');

import LayoutHeader from "./header/layout-header.vue";
import LayoutFooter from "./footer/layout-footer.vue";
import LoadingModal from "./modals/loading.modal"

export default {

    components: { LayoutHeader, LayoutFooter, LoadingModal}

}

</script>


<style scoped>

    .layout {

    }


</style>