<template>

   <div class="header">

      <div class="boxed" >

         <div class="row">
            <img :src="logo" class="logo" >

            <span class="thicker">{{title}}</span>

            <div class="account">
               <img :src="identicon" class="circle identicon">
            </div>

         </div>

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
        },

        identicon(){
           return 'https://www.gravatar.com/avatar/7210278e402d3907234586653e55a35c7e8cb2c8a7cf5b5f61fbfd835999de64?d=retro&f=y';
        }

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
      padding-top: 10px;
      padding-bottom: 10px;
   }

   .row{
      display: grid;
      grid-template-columns: 50px 100px 1fr;
      align-items: center;
   }

   .account{
      margin-left:auto;
      margin-right:0;
    }

   .identicon{
      width: 40px;
   }

</style>