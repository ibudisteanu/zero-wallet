<template>

    <div>

        <left-sidebar ref="refSidebar" :onUpdateMarginLeft="onUpdateMarginLeft" />

        <div class="layout" :style="{marginLeft: marginLeft+'px' }">

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
            marginLeft: 0,
        }
    },

    methods:{

        onUpdateMarginLeft(value){
            console.log("pdate", value);
            this.marginLeft = value;
        }

    },

    mounted(){
        this.marginLeft = this.$refs.refSidebar.width;
    }

}

</script>


<style scoped>

    .layout {
    }


</style>