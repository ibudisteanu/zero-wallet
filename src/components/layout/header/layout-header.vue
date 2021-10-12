<template>

   <nav class="navbar navbar-light navbar-glass navbar-top navbar-expand">

      <button class="btn navbar-toggler-humburger-icon navbar-toggler me-1 me-sm-3" @click="handleToggleLeftSidebar">
         <span class="navbar-toggle-icon">
            <span class="toggle-line"></span>
         </span>
      </button>

      <router-link class="navbar-brand me-1 me-sm-3" to="/">
         <div class="d-flex align-items-center">
            <img class="me-2" :src="require('src/assets/pandora-pay-logo-square.png').default" alt="" width="40">
         </div>
      </router-link>

      <ul class="navbar-nav navbar-nav-icons flex-row align-items-center">

         <li class="nav-item" v-tooltip.bottom="`Switch theme`">
            <i :class="`fa fa-${$store.state.settings.dark ?'sun':'moon'} nav-item-icon pointer`" @click="handleToggleDark"></i>
         </li>

         <li class="nav-item pointer unselectable" v-tooltip.bottom="`${showNetworksMenu ? '' :'Select network'}`" @click="handleToggleNetworksMenu" v-on-clickaway="closeNetworksMenu">
            <i class="fa fa-globe-americas nav-item-icon"></i>
            <span class="badge badge-soft-success">{{$store.state.network.networkName}}</span>
            <i class="fa fa-chevron-down"></i>

            <div :class="`dropdown-menu dropdown-menu-end py-0 ${showNetworksMenu ? 'show': ''}`">
               <div class="bg-white rounded-2 py-2">
                  <a class="dropdown-item" href="#">MAIN Net</a>
                  <a class="dropdown-item" href="#">DEV Net</a>
                  <a class="dropdown-item" href="#">TEST Net</a>
               </div>
            </div>

         </li>
         <li class="nav-item" style="padding-right: 0">
            <header-account />
         </li>
      </ul>

   </nav>
</template>

<script>

import consts from "consts/consts"
import HeaderAccount from "./account/header-account"
import { mixin as clickaway } from 'vue-clickaway'

export default {

   components: {HeaderAccount},

   mixins: [ clickaway ],

   data(){
      return {
         showNetworksMenu: false,
      }
   },

   computed:{
      title(){
         return consts.title;
      },
      faucetTestnetEnabled(){
         return this.$store.state.faucet.faucetTestnetEnabled
      }
    },

   methods: {

      handleToggleDark(){
         this.$store.commit('setDark', !this.$store.state.settings.dark)
      },
      handleToggleLeftSidebar(e){
         this.$store.commit('setLeftSidebarShow', !this.$store.state.page.leftSidebarShow)
         if (e) e.stopPropagation()
      },
      handleToggleNetworksMenu(){
         this.showNetworksMenu = !this.showNetworksMenu
      },
      closeNetworksMenu(){
         this.showNetworksMenu = false
      }
   }

}
</script>

<style scoped>

   .navbar-nav{
      margin-left: auto;
      margin-right: 0;
   }
   .nav-item-icon {
      font-size: 16px;
   }
   .nav-item{
      padding-right: 10px;
   }
   .fa-chevron-down{
      font-size: 10px;
   }

</style>
