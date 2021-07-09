<template>


    <main :class="`main`" >

<!--        <warning-bar v-if="$store.getters.isTestnet" />-->

        <div class="container" data-layout="container">

            <left-sidebar v-if="!disableLayout" ref="refSidebar" @onUpdateMarginLeft="onUpdateMarginLeft" />

            <div class="content">

                <layout-header v-if="!disableLayout" > </layout-header>

                <slot/>

                <loading-modal ref="refLoadingModal" />

                <account-type ref="refAccountTypeModal" />

                <layout-footer v-if="!disableLayout" />

            </div>

        </div>
    </main>

</template>

<script>

require('src/assets/common.css');

import LayoutHeader from "./header/layout-header.vue";
import LayoutFooter from "./footer/layout-footer.vue";
import LoadingModal from "./modals/loading.modal"
import AccountType from "./modals/account-type.modal"
import LeftSidebar from "./left-sidebar/left-sidebar"
import WarningBar from "./header/warning-bar"

export default {

    components: {AccountType, LeftSidebar, LayoutHeader, LayoutFooter, LoadingModal, WarningBar},

    props: {
        disableLayout: false,
    },

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
