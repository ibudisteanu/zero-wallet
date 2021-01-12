<template>

    <div>

        <left-sidebar ref="refSidebar" @onUpdateMarginLeft="onUpdateMarginLeft" />

        <div class="layout" :style="{paddingLeft: marginLeft }">

            <warning-bar />

            <layout-header > </layout-header>

            <slot/>

            <loading-modal ref="refLoadingModal" />

            <account-type ref="refAccountTypeModal" />

            <layout-footer> </layout-footer>

        </div>
    </div>

</template>

<script>

require('src/assets/common.css');
require('src/assets/grid.css');

import LayoutHeader from "./header/layout-header.vue";
import LayoutFooter from "./footer/layout-footer.vue";
import LoadingModal from "./modals/loading.modal"
import AccountType from "./modals/account-type.modal"
import LeftSidebar from "./left-sidebar/left-sidebar"
import WarningBar from "./header/warning-bar"

export default {

    components: {AccountType, LeftSidebar, LayoutHeader, LayoutFooter, LoadingModal, WarningBar},

    data(){
        return {
            marginLeft: '85px',
            width: '100%',
        }
    },

    methods:{

        onUpdateMarginLeft({marginLeft, width}){
            this.marginLeft = marginLeft;
        }

    },

    mounted(){
        this.$store.commit('setLoadingModal', this.$refs.refLoadingModal);
        this.$store.commit('setAccountTypeModal', this.$refs.refAccountTypeModal);
    }

}

</script>


<style scoped>

    .layout {
    }


</style>