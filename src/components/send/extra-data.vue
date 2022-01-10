<template>
    <div>

        <div class="col">

            <div class="form-check">
                <input class="form-check-input" id="typePublic" type="radio" value="public" v-model="type" />
                <label class="form-check-label" for="typePublic">Public Message</label>
                <i class="fas fa-question " v-tooltip.bottom="`The message will be public on the chain. Anybody can see this message attached to this transaction.`" />
            </div>
            <div v-if="type === 'public'">
                <div class="form-check">
                    <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Message:</label>
                    <input class="form-control" type="text" v-model="data" :disabled="!!paymentID">
                </div>
            </div>

            <template v-if="destinations">

                <div class="form-check pt-2">
                    <input class="form-check-input" id="typeEncrypted" type="radio" value="encrypted" v-model="type" />
                    <label class="form-check-label" for="typeEncrypted">Encrypted Message</label>
                    <i class="fas fa-question " v-tooltip.bottom="`The message will encrypted to the destination. Only the receiver can decrypt the message attached to this transaction.`" />
                </div>
                <div v-if="type === 'encrypted'">
                    <div class="form-check">
                        <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Message:</label>
                        <input class="form-control" type="text" v-model="data" :disabled="!!paymentID">
                    </div>
                    <div class="form-check">

                        <template v-if="destinations.length > 1">
                            <label class="form-label ls text-uppercase text-600 fw-semi-bold mb-0 fs--1">Address to encrypt:</label>

                            <div :class="`${publicKeyToEncrypt ? 'destination-row' : '' }`" >

                                <account-identicon v-if="publicKeyToEncrypt" :public-key="publicKeyToEncrypt" size="30" outer-size="8" />

                                <select :class="`form-select ${validationPublicKeyToEncrypt ? 'is-invalid' :''} `" v-model="publicKeyToEncrypt">
                                    <option v-for="(destination, id) in destinations"
                                            :key="`selected-address-${id}`"
                                            :value="(destination.address && destination.address.publicKey) ? destination.address.publicKey : '' "
                                            :class="`${ (destination.address && destination.address.publicKey) ? '' : 'text-danger'}`">
                                        <template v-if="destination.address">
                                            {{destination.addressEncoded}}
                                        </template>
                                    </option>
                                </select>

                            </div>
                        </template>

                        <div v-if="validationPublicKeyToEncrypt" class="invalid-feedback d-block">{{validationPublicKeyToEncrypt}}</div>

                    </div>
                </div>

            </template>

        </div>

    </div>
</template>

<script>
import AccountIdenticon from "src/components/wallet/account/account-identicon"
const {version} = PandoraPay.enums.wallet.address;

export default {

    components: {AccountIdenticon},

    props: {
        destinations: {default: null},
        paymentID: {default: null},
    },

    data(){
        return {
            error: '',
            type: "public",
            data: '',
            publicKeyToEncrypt: null,
        }
    },

    computed:{

        validationData(){
            if (this.data.length > 512) return "length is invalid"
        },

        validationPublicKeyToEncrypt(){
            if (this.type === "public") return
            if (this.destinations.length > 1 && !this.publicKeyToEncrypt) return "No selected address"
        },

        validationError(){
            if (this.validationPublicKeyToEncrypt) return this.validationPublicKeyToEncrypt
            if (this.validationData) return this.validationData
        }

    },

    watch: {

        paymentID: {
            immediate: true,
            handler: function (to, from) {

                if (to && this.data !== to )
                    return this.data = to

                if (this.data === from) this.data = ""
            },
        },

        type: {
            immediate: true,
            handler: function (to, from) {
                return this.$emit('changed', {
                    type: to,
                    publicKeyToEncrypt: (to === 'public') ? null : this.publicKeyToEncrypt,
                })
            }
        },

        data: {
            immediate: true,
            handler: function (to, from) {
                return this.$emit('changed', {data: to,})
            }
        },

        publicKeyToEncrypt: {
            immediate: true,
            handler: function (to, from) {
                return this.$emit('changed', {publicKeyToEncrypt: to,})
            }
        },

        validationError: {
            immediate: true,
            handler: function (to, from) {
                return this.$emit('changed', {validationError: to,})
            }
        }

    },

}
</script>


<style scoped>

    .destination-row{
        display: grid;
        grid-template-columns: 45px 1fr;
        grid-column-gap: 10px;
    }
</style>
