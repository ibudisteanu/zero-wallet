<template>

   <div class="header pd-top-10 pd-bottom-10">

      <div class="boxed" >

         <div class="row">

            <router-link to="/">
               <img :src="require('src/assets/pandora-pay-logo-inline.png').default" class="logo" >
            </router-link>

            <header-account />

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

   .row{
      display: grid;
      grid-template-columns: 150px 1fr;
      align-items: center;
   }

   .row a{
      color: black;
      align-items: center;
   }

</style>