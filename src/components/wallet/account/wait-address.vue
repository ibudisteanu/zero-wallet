<template>

  <div>
    <template v-if="address">
      <slot></slot>
    </template>
    <div class="py-3 text-center" v-else>
      <loading-spinner class="fs-3"/>
    </div>
  </div>

</template>

<script>
import LoadingSpinner from "src/components/utils/loading-spinner";

export default {

  components: {LoadingSpinner},

  props: {
    address: {default: null},
  },

}
</script>