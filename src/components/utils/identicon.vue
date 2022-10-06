<template>

  <component :is="type" :to="uri" v-tooltip.bottom="`${ tooltip}`" class="pointer">
    <div :class="`identicon ${outerSize? 'outer':''}`" :style="`padding: ${outerSize}px`" v-if="identiconSrc">
      <img v-if="identiconSrc" :src="identiconSrc" class="identicon" :style="`width: ${size}px`" >
    </div>
  </component>

</template>

<script>

import Identicons from "src/utils/identicons"
export default {

  props:{
    size: {default: 40},
    outerSize: {default: 34},

    uri: {default: ""},
    hash: {default: null},

    tooltip: {default: ""}
  },

  computed:{
    type(){
      if ( !this.uri ) return "span"
      return "router-link"
    }
  },

  data(){
    return{
      identiconSrc: "",
      finalAddress: "",
    }
  },

  methods:{
    async load(){
      try{
        if (!this.hash) throw "invalid"
        this.identiconSrc = await Identicons.getIdenticon( this.hash, this.size )
      }catch(err){
        this.finalAddress = ""
        this.identiconSrc = ""
      }
    },
  },

  watch:{
    hash:{
      handler (val, oldVal) {
        if (val === oldVal) return
        return this.load()
      }
    }
  },

  mounted(){
    return this.load()
  },

}
</script>

<style scoped>


.outer{
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  -khtml-border-radius: 50%;
  border-radius: 50%;
  overflow: hidden;
  padding: 10px;
}

.identicon{
  display: inline-table;
  background-color: white;
}

.dark .identicon{
  background-color: black;
}

</style>
