<template>
    <layout>

        <layout-title icon="fas fa-wrench" title="Settings">Configure your web wallet for a better experience.</layout-title>

        <div class="card overflow-hidden">
            <div class="card-header card-header audience-chart-header p-0 bg-light scrollbar-overlay ">
                <ul class="nav nav-tabs border-0 chart-tab flex-nowrap" >
                    <li class="nav-item" role="presentation" @click="tab='balanceDecoder'">
                        <a :class="`nav-link mb-0 ${tab === 'balanceDecoder' ? 'active' : ''}`">
                            <div class="audience-tab-item p-2 pe-4">
                                <h6 class="text-800 fs--2 text-nowrap">Balance decoder</h6>
                                <h5 class="text-800 align-middle">
                                    <i class="fas fa-laptop-code"></i>
                                    Decoder
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
                    <div :class="`tab-pane ${tab === 'balanceDecoder' ? 'active' : ''}`">
                        <div class="row pt-2">
                            <div class="col-12 col-sm-6">
                                <label>Precomputed Table size: {{balanceDecoderTableSize}} <i class="fas fa-question" v-tooltip.bottom="'Balance Decoder Precomputed Init Table'" /> </label> <br/>
                                <label>Scanner Performance: {{balanceDecoderPerformance[balanceDecoderTableSize]}}/s <i class="fas fa-question" v-tooltip.bottom="'Balance Decoder performance using this precomputed table'" /> </label>
                                <input class="form-range" type="range" min="16" max="22" v-model="balanceDecoderTableSize" />
                                <small :class="`fw-semi-bold rounded-pill badge-soft-${balanceDecoderTableSize >= 20 ? 'danger' : 'warning'} p-1`">
                                    <i class="fas fa-exclamation-triangle" /> High will require {{formatMilliseconds( balanceDecoderTime[balanceDecoderTableSize] *1000 )}} initialize (bootstrap) time.
                                </small>
                            </div>
                        </div>
                    </div>
                    <div :class="`tab-pane ${tab === 'expert' ? 'active' : ''}`">
                        <div class="row pt-2">
                            <div class="col-12 col-sm-6">
                                <div>
                                  <input class="form-check-input" id="legacyNonHardening" type="checkbox" v-model="legacyNonHardening" @change="changeLegacyNonHardening" />
                                  <label class="form-check-label" for="legacyNonHardening">Legacy Non Hardening</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer bg-light py-2">

                <alert-box v-if="error" class="w-100" type="error" :dismissible-timeout="10000" :dismissible-text="error" @onDismissible="error=''">{{error}}</alert-box>
                <alert-box v-if="status" class="w-100" type="success" :dismissible-timeout="10000" :dismissible-text="status" @onDismissible="status=''">{{status}}</alert-box>
                <alert-box v-if="info" class="w-100" type="info" :dismissible-timeout="10000" :dismissible-text="info" @onDismissible="status=''" ></alert-box>

                <div class="float-end">
                    <loading-button text="Save settings" @submit="handleSave" icon="fas fa-save"  />
                </div>

            </div>
        </div>

    </layout>
</template>

<script>
import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title";
import StringHelper from "src/utils/string-helper";
import LoadingButton from "../../components/utils/loading-button";
import AlertBox from "src/components/utils/alert-box"

export default {

    components: {LoadingButton, Layout, LayoutTitle, StringHelper, AlertBox},

    data(){
        return {
            error: "",
            status: "",
            info: "",
            balanceDecoderTableSize: 18,
            tab: "balanceDecoder",
            legacyNonHardening: false,
        }
    },

    computed:{
        balanceDecoderTime(){
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
        balanceDecoderPerformance(){
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
        formatMilliseconds: (milliseconds) => StringHelper.formatMilliseconds(milliseconds),

        handleSave(resolver){
            try{
                this.status = ""
                this.$store.commit('setBalanceDecoderTableSize', this.balanceDecoderTableSize)
                this.status = "Balance Decoder table stored"
                this.info = "Restart is required to have an effect"
            }catch(err) {
                this.error = err.toString()
            }finally{
                resolver()
            }
        },

        changeLegacyNonHardening(){
          PandoraPay.wallet.manager.setWalletNonHardening(this.legacyNonHardening)
        },

    },

    mounted(){
        this.balanceDecoderTableSize = this.$store.state.settings.balanceDecoderTableSize
    }

}
</script>