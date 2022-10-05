<template>
  <layout>

    <layout-title icon="fas fa-terminal" title="Encoded Link">Import Encoded Links</layout-title>

    <div class="card mb-3">
      <div class="card-header bg-light">
        <div class="row align-items-center">
          <div class="col">
            <h5 class="mb-0 text-truncate">Provide Encoded Link</h5>
          </div>
        </div>
      </div>
      <div class="card-body p-3 fs--1">
        <textarea class="form-control" rows="8" v-model="link"></textarea>
      </div>
      <div class="card-footer">
        <alert-box v-if="error" type="error">{{ error }}</alert-box>
        <div class="d-flex justify-content-end">
          <button class="btn btn-outline-primary" type="button" @click="importLink">
            <i class="fas fa-cogs"></i> Import Encoded Link
          </button>
        </div>
      </div>
    </div>

  </layout>
</template>

<script>
import Layout from "src/components/layout/layout";
import LayoutTitle from "src/components/layout/layout-title";
import AlertBox from "src/components/utils/alert-box"

export default {
  components: {Layout, LayoutTitle, AlertBox},

  data() {
    return {
      error: "",
      link: "",
    }
  },

  methods: {
    importLink() {
      try {
        const link = this.link.trim()
        if (!link || link.length < 5) throw `The link is too short`
        if (link[0] !== '/') throw `The link should start with "\\"`

        this.$router.push(link)
      } catch (e) {
        this.error = e.toString()
      }
    }
  },

}
</script>