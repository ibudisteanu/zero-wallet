<template>
  <div class="progress mb-3  position-relative" style="height:15px">
    <div class="progress-bar bg-primary progress-bar-striped progress-bar-animated" role="progressbar"
         :style="`width: ${value}%`">
    </div>
    <small class="justify-content-center d-flex position-absolute w-100">{{ text }}</small>
  </div>
</template>

<script>
export default {

  props: {
    value: {default: 0},
    text: {default: ''}
  }

}
</script>

<style scoped>

</style>
