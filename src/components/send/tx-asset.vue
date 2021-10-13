<template>
    <div class="row">
        <div class="col-12" >
            <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Asset</label>
            <select :class="`form-select ${validationAssetError ? 'is-invalid' :''}`" v-model="selectedAsset">
                <option v-for="(asset, id) in assets"
                        :key="`send-money-${id}`"
                        :value="asset">
                    {{getAssetName(asset)}} {{asset}}
                </option>
            </select>
            <div v-if="validationAssetError" class="invalid-feedback d-block">{{validationAssetError}}</div>
        </div>
    </div>
</template>

<script>
export default {

    data(){
        return {
            selectedAsset: null,
        }
    },

    props:{
        text: {default: 'Amount'},
        assets: {default: null },
    },

    computed:{
        selectedAssetInfo(){
            if (this.selectedAsset === null) return null
            return this.$store.getters.getAsset( this.selectedAsset );
        },
        validationAssetError(){
            if ( !this.selectedAssetInfo) return "Asset was not selected"
        },
        validationError(){
            if (this.validationAssetError) return this.validationAssetError
        }
    },

    methods:{

        getAsset(assetId){
            return this.$store.getters.getAsset( assetId );
        },

        getAssetName(asset){
            const assetInfo = this.getAsset( asset )
            if (assetInfo)
                return assetInfo.name;
        },

    },

    watch: {

        assets: {
            immediate: true,
            handler: function(to, from){
                if (!to)
                    return this.selectedAsset = null

                this.selectedAsset = to[0]
            }
        },

        selectedAsset: {
            immediate: true,
            handler: function (to, from) {
                return this.$emit('changed', {asset: to,})
            }
        },

        validationError: {
            immediate: true,
            handler: function (to, from) {
                return this.$emit('changed', {validationError: to,})
            }
        },

    },

}
</script>

<style scoped>
</style>
