<template>

   <div class="header">

      <div class="boxed">

         <img :src="logo" class="logo">

         <span>{{title}}</span>

      </div>

   </div>

</template>

<script>

import consts from "consts/consts"

export default {

    computed:{

        logo(){
            return consts.logo;
        },

        title(){
            return consts.title;
        }

    },

}
</script>

<style scoped>

   .logo{
      width: 50px
   }

   .header {
      width: 100%;
      background-color: #EEEEEE;
   }
</style>