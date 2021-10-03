<template>
    <div class="row">
        <div class="col-12" >
            <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Token</label>
            <select :class="`form-select ${validationTokenError ? 'is-invalid' :''}`" v-model="selectedToken">
                <option v-for="(token, id) in tokens"
                        :key="`send-money-${id}`"
                        :value="token">
                    {{getTokenName(token)}} {{token}}
                </option>
            </select>
            <div v-if="validationTokenError" class="invalid-feedback d-block">{{validationTokenError}}</div>
        </div>
    </div>
</template>

<script>
export default {

    data(){
        return {
            selectedToken: null,
        }
    },

    props:{
        text: {default: 'Amount'},
        tokens: {default: null },
    },

    computed:{
        selectedTokenInfo(){
            if (this.selectedToken === null) return null
            return this.$store.getters.getToken( this.selectedToken );
        },
        validationTokenError(){
            if ( !this.selectedTokenInfo) return "Token was not selected"
        },
        validationError(){
            if (this.validationTokenError) return this.validationTokenError
        }
    },

    methods:{

        getToken(token){
            return this.$store.getters.getToken( token );
        },

        getTokenName(token){
            const tokenInfo = this.getToken( token )
            if (tokenInfo)
                return tokenInfo.name;
        },

    },

    watch: {

        selectedToken: {
            immediate: true,
            handler: function (to, from) {
                return this.$emit('changed', {token: to,})
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
