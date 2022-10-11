<template>
  <layout>

    <layout-title icon="fas fa-wrench" title="Settings">Configure your web wallet for a better experience.
    </layout-title>

    <div class="card overflow-hidden">
      <div class="card-header card-header audience-chart-header p-0 bg-light scrollbar-overlay ">
        <ul class="nav nav-tabs border-0 chart-tab flex-nowrap">
          <li class="nav-item" role="presentation" @click="tab='balanceDecryptor'">
            <a :class="`nav-link mb-0 ${tab === 'balanceDecryptor' ? 'active' : ''}`">
              <div class="audience-tab-item p-2 pe-4">
                <h6 class="text-800 fs--2 text-nowrap">Balance Decryptor</h6>
                <h5 class="text-800 align-middle">
                  <i class="fas fa-laptop-code"></i>
                  Decryptor
                </h5>
              </div>
            </a>
          </li>
          <li class="nav-item" role="presentation" @click="tab='expert'">
            <a :class="`nav-link mb-0 ${tab === 'expert' ? 'active' : ''}`">
              <div class="audience-tab-item p-2 pe-4">
                <h6 class="text-800 fs--2 text-nowrap">Expert</h6>
                <h5 class="text-800 align-middle">
                  <i class="fas fa-laptop-code"></i>
                  Expert settings
                </h5>
              </div>
            </a>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <div class="tab-content">
          <div :class="`tab-pane ${tab === 'balanceDecryptor' ? 'active' : ''}`">
            <div class="row pt-2">
              <div class="col-12 col-sm-6">
                <label>Precomputed Table size: {{ balanceDecryptorTableSize }} <i class="fas fa-question ms-1"
                                                                                  v-tooltip.bottom="'Balance Decryptor Precomputed Init Table'"/>
                </label> <br/>
                <label>Scanner Performance: {{ balanceDecryptorPerformance[balanceDecryptorTableSize] }}/s
                  <i class="fas fa-question ms-1" v-tooltip.bottom="'Balance Decryptor performance using this precomputed table'"/> </label>
                <input class="form-range" type="range" min="16" max="22" v-model="balanceDecryptorTableSize"/>
                <small :class="`fw-semi-bold rounded-pill badge-soft-${balanceDecryptorTableSize >= 20 ? 'danger' : 'warning'} p-1`">
                  <i class="fas fa-exclamation-triangle"/> High will require
                  {{ $formatMilliseconds(balanceDecryptorTime[balanceDecryptorTableSize] * 1000) }} initialize (bootstrap) time.
                </small>
              </div>
            </div>
          </div>
          <div :class="`tab-pane ${tab === 'expert' ? 'active' : ''}`">
            <div class="row pt-2">
              <div class="col-12 col-sm-6">
                <div>
                  <input class="form-check-input" id="legacyNonHardening" type="checkbox" v-model="legacyNonHardening" @change="changeLegacyNonHardening"/>
                  <label class="form-check-label" for="legacyNonHardening">Legacy Non Hardening</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer bg-light py-2">

        <alert-box v-if="error" class="w-100" type="error" :dismissible-timeout="10000" :dismissible-text="error" @onDismissible="error=''">
          {{ error }}
        </alert-box>
        <alert-box v-if="status" class="w-100" type="success" :dismissible-timeout="10000" :dismissible-text="status" @onDismissible="status=''">
          {{ status }}
        </alert-box>
        <alert-box v-if="info" class="w-100" type="info" :dismissible-timeout="10000" :dismissible-text="info" @onDismissible="status=''"></alert-box>

        <div class="float-end">
          <loading-button text="Save settings" :submit="handleSave" icon="fas fa-save"/>
        </div>

      </div>
    </div>

  </layout>
</template>

<script>
import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title";
import LoadingButton from "../../components/utils/loading-button";
import AlertBox from "src/components/utils/alert-box"

export default {

  components: {LoadingButton, Layout, LayoutTitle, AlertBox},

  data() {
    return {
      error: "",
      status: "",
      info: "",
      balanceDecryptorTableSize: 18,
      tab: "balanceDecryptor",
      legacyNonHardening: false,
    }
  },

  computed: {
    balanceDecryptorTime() {
      return {
        16: 8,
        17: 12,
        18: 30,
        19: 50,
        20: 120,
        21: 200,
        22: 600,
      }
    },
    balanceDecryptorPerformance() {
      return {
        16: 125,
        17: 250,
        18: 500,
        19: 1000,
        20: 2000,
        21: 4000,
        22: 8500,
      }
    }
  },

  methods: {

    handleSave() {
        this.status = ""
        this.$store.commit('setBalanceDecryptorTableSize', this.balanceDecryptorTableSize)
        this.status = "Balance Decryptor table stored"
        this.info = "Restart is required to have an effect"
    },

    changeLegacyNonHardening() {
      PandoraPay.wallet.manager.setWalletNonHardening(this.legacyNonHardening)
    },

  },

  mounted() {
    this.balanceDecryptorTableSize = this.$store.state.settings.balanceDecryptorTableSize
  }

}
</script>