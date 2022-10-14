<template>
  <component :class="`${classCustom}`" type="button" @click="handleClick" :is="component" v-tooltip.bottom="tooltip">

    <loading-spinner v-if="!loaded"/>
    <template v-else>
      <i v-if="icon && iconLeft" :class="`${icon}`"/>
      <span v-if="text" :class="`${classText} ${iconLeft ? 'ps-1' : '' }`">{{ text }}</span>
      <i v-if="icon && !iconLeft" :class="`${icon}`"/>
    </template>

  </component>
</template>

<script>
import LoadingSpinner from "src/components/utils/loading-spinner";

export default {
  components: {LoadingSpinner},
  data: function () {
    return {
      loaded: true,
      disabled: false,
    }
  },
  props: {
    classCustom: {default: "btn btn-falcon-primary me-1 mb-1"},
    text: {default: 'Submit'},
    icon: {default: 'fas fa-share'},
    iconLeft: {default: true},
    component: {default: "button"},
    tooltip: {default: ""},
    submit: {default: null },
    classText: {default: ""},
  },
  methods: {
    async handleClick(e) {

      if (this.disabled ) return false;

      this.loaded = false;
      this.disabled = true;

      try{
        if (this.submit) await this.submit()
      }catch(e){
        this.$store.dispatch('addToast', {type:"error", title:`Unexpected error`, text: e.toString() })
      }finally {
        this.loaded = true;
        this.disabled = false;
      }

    },
  }
}
</script>

<style scoped>
span {
  display: inline-block;
}
</style>
