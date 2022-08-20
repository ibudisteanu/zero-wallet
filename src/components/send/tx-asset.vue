<template>
    <div class="row">
        <div class="col-12" >
            <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Asset</label>
            <select :class="`form-select ${validationError ? 'is-invalid' :''}`" v-model="selectedAsset">
                <option v-for="(asset, id) in assets"
                        :key="`send-money-${id}`"
                        :value="asset">
                    {{getAssetName(asset)}} {{$base64ToHex(asset) }}
                </option>
            </select>
            <div v-if="validationError" class="invalid-feedback d-block">{{validationError}}</div>
        </div>
    </div>
</template>

<script>
export default {

    props:{
        text: {default: 'Amount'},
        assets: {default: null },
    },

    data(){
        return {
            selectedAsset: null,
        }
    },

    computed:{
        selectedAssetInfo(){
            if (this.selectedAsset === null) return null
            return this.$store.getters.getAsset( this.selectedAsset );
        },
        validationError(){
            if ( !this.selectedAssetInfo) return "Asset was not selected"
        },
    },

    methods:{

        getAsset(assetId){
            return this.$store.getters.getAsset( assetId );
        },

        getAssetName(asset){
            const assetInfo = this.getAsset( asset )
            return assetInfo ? assetInfo.identification : '';
        },

    },

    watch: {

        assets: {
            immediate: true,
            handler: function(to, from){
                if (!to) return this.selectedAsset = null

                for (const asset of to)
                    if (asset === this.selectedAsset)
                        return

                this.selectedAsset = to[0]
            }
        },

        selectedAsset: {
            immediate: true,
            handler: function (to, from) {
                return this.$emit('changed', {
                    asset: to,
                })
            }
        },

        validationError: {
            immediate: true,
            handler: async function  (to, ) {
                this.$emit('changed', {
                    assetValidationError: to,
                });
            }
        }

    },

}
</script>

<style scoped>
</style>
