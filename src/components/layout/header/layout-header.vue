<template>

   <b>Hello World</b>

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