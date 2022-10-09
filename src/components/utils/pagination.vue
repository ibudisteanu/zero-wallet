<template>
  <div class="w-100 d-flex align-items-center justify-content-center" v-if="total.gt(0)">

    <nav :aria-label="label">
      <ul class="pagination m-0">
        <li class="page-item" v-if="(!inverted) ? current.lt( total.minus(1) ) : current.gt(1)">
          <router-link :to="`${prefix}${inverted ? 0 : total.minus(1) }${suffix ? '/'+suffix : '' }`" class="page-link">
            <span>{{ inverted ? 0 : total.minus(1) }} «</span>
          </router-link>
        </li>
        <li class="page-item" v-if="(!inverted) ? current.lt(total) : current.gt(0)">
          <router-link :to="`${prefix}${inverted ? current.minus(1) : current.plus(1)}${suffix ? '/'+suffix : '' }`" class="page-link">
            <span>{{ inverted ? current.minus(1) : current.plus(1) }}</span>
          </router-link>
        </li>
        <li class="page-item active">
          <router-link :to="`${prefix}${current}${suffix ? '/'+suffix : '' }`" class="page-link">
            <span>{{ current }}</span>
          </router-link>
        </li>
        <li class="page-item" v-if="inverted ? current.lt(total) : current.gt(0)">
          <router-link :to="`${prefix}${inverted ? current.plus(1) : current.minus(1) }${suffix ? '/'+suffix : '' }`" class="page-link">
            <span>{{ inverted ? current.plus(1) : current.minus(1) }}</span>
          </router-link>
        </li>
        <li class="page-item" v-if="inverted ? current.lt( total.minus(1) ) : current.gt(1)">
          <router-link :to="`${prefix}${inverted ? total : 0}${suffix ? '/'+suffix : '' }`" class="page-link">
            <span>» {{ inverted ? total : 0 }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

  </div>
</template>

<script>
import Decimal from "decimal.js"

export default {

  props: {
    label: {default: ""},
    total: {default: () => new Decimal(0)},
    current: {default: () => new Decimal(0)},
    countPerPage: {default: 20},
    prefix: {default: ""},
    suffix: {default: ""},
    inverted: {default: false}
  },

  methods: {},

}
</script>

<style scoped>

</style>
