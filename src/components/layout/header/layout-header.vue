<template>

   <nav class="navbar navbar-light navbar-glass navbar-top navbar-expand">

      <button class="btn navbar-toggler-humburger-icon navbar-toggler me-1 me-sm-3" @click="handleToggleLeftSidebar">
         <span class="navbar-toggle-icon">
            <span class="toggle-line"></span>
         </span>
      </button>

      <ul class="navbar-nav navbar-nav-icons flex-row align-items-center">

         <li class="nav-item">
            <i :class="`fa fa-${$store.state.page.dark ?'sun':'moon'} nav-item-icon pointer`" @click="handleToggleDark"></i>
         </li>

         <li class="nav-item">
            <i class="fa fa-globe-americas nav-item-icon"></i>
            <span class="badge badge-soft-success">{{$store.state.network.networkName}}</span>
            <i class="fa fa-chevron-down"></i>

            <div :class="`dropdown-menu dropdown-menu-end py-0 ${0 ? 'show': ''}`">
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

export default {

   components: {HeaderAccount},

    computed:{
        title(){
            return consts.title;
        },
    },

   methods: {
      handleToggleDark(){
         this.$store.commit('setDark', !this.$store.state.page.dark)
      },
      handleToggleLeftSidebar(){
         this.$store.commit('setLeftSidebarShow', !this.$store.state.page.leftSidebarShow)
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
      padding-right: 20px;
   }
   .fa-chevron-down{
      font-size: 10px;
   }

</style>
