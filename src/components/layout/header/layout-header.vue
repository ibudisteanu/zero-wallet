<template>

   <div class="header pd-top-10 pd-bottom-10">

      <div class="boxed" >

         <div class="row">
            <img :src="logo" class="logo" >

            <span class="thicker">{{title}}</span>

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

        logo(){
            return consts.logo;
        },

        title(){
            return consts.title;
        },



    },

}
</script>

<style scoped>

   .logo{
      width: 40px
   }

   .header {
      width: 100%;
      background-color: #EEEEEE;
   }

   .row{
      display: grid;
      grid-template-columns: 50px 100px 1fr;
      align-items: center;
   }



</style>