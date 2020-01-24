<template>

    <div>

        <left-sidebar ref="refSidebar" @onUpdateMarginLeft="onUpdateMarginLeft" />

        <div class="layout" :style="{paddingLeft: marginLeft }">

            <warning-bar />

            <layout-header > </layout-header>

            <slot/>

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
import WarningBar from "./header/warning-bar"

export default {

    components: { LeftSidebar, LayoutHeader, LayoutFooter, LoadingModal, WarningBar},

    data(){
        return {
            marginLeft: '70px',
            width: '100%',
        }
    },

    methods:{

        onUpdateMarginLeft({marginLeft, width}){
            console.log("pdate", marginLeft, width);
            this.marginLeft = marginLeft;
        }

    },

}

</script>


<style scoped>

    .layout {
    }


</style>