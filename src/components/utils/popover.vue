<template>
  <div class="popover fade show bs-popover-top" data-popper-placement="top"
       :style="`transform: translate(${left}px, ${top}px); width: ${width}px`">
    <div class="popover-arrow"
         :style="`transform: translate(${Math.floor(width/2)}px, 0px);`"></div>
    <div class="popover-body">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    left: {default: 100},
    top: {default: 0},
    width: {default: 200},
  }
}
</script>

<style scoped>
.popover {
  position: absolute;
  margin: 0px;
}

.popover-arrow {
  position: absolute;
  left: 0px;
}
</style>
