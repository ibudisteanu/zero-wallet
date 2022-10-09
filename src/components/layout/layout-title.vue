<template>
  <div class="d-flex mb-3 mt-2">
    <span class="fa-stack me-2 ms-n1"><i :class="`bg-white icon-item text-primary ${icon}`"></i></span>
    <div class="col">
      <h5 class="mb-0 text-primary position-relative">
        <span class="bg-200 dark__bg-1100 pe-3">{{ title }}</span>
        <span class="border position-absolute top-50 translate-middle-y w-100 start-0 z-index--1"></span>
      </h5>
      <p class="mb-0"><slot/></p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {default: ""},
    icon: {default: ""},
  }
}
</script>
