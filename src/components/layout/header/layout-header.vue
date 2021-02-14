<template>

   <div class="header pd-top-10 pd-bottom-10">

      <div class="container boxed" >

         <div class="layout-row">

            <router-link to="/">
               <img :src="require('src/assets/pandora-pay-logo-inline.png').default" class="logo" >
            </router-link>

            <div class="header-right-menu">
               <div class="inline">
                  <div class="network-text">
                     {{$store.getters.networkName}}
                  </div>
                  <header-account />
               </div>

            </div>

         </div>

      </div>

   </div>

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

}
</script>

<style scoped>

   .logo{
      max-height: 64px;
   }

   .header {
      width: 100%;
      background-color: #EEEEEE;
   }

   .layout-row{
      display: grid;
      grid-template-columns: 150px 1fr;
      align-items: center;
   }

   .layout-row a{
      color: black;
      align-items: center;
   }

   .header-right-menu{
      margin-left:auto;
      margin-right:0;
   }

   .header-right-menu .inline{
      display: flex;
      align-items: center;
      flex-direction: row;
   }

   .header-right-menu .network-text{
      padding-right: 10px;
   }

</style>