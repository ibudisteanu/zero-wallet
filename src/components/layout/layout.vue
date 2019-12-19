<template>

    <div class="layout">

        <layout-header > </layout-header>

        <slot></slot>

        <layout-footer> </layout-footer>

    </div>

</template>

<script>

require('./common.css');

import LayoutHeader from "./header/layout-header.vue";
import LayoutFooter from "./footer/layout-footer.vue";

export default {

    components: { LayoutHeader, LayoutFooter}

}

</script>


<style scoped>

    .layout {

    }


</style>