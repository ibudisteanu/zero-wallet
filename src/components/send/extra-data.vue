<template>
    <div>

        <div class="col">

            <div class="form-check">
                <input class="form-check-input" id="typePublic" type="radio" value="public" v-model="type" />
                <label class="form-check-label" for="typePublic">Public Message</label>
            </div>
            <div v-if="type === 'public'">
                <div class="form-check">
                    <label class="form-check-label">Message:</label>
                    <input class="form-control" type="text" v-model="data" :disabled="!!paymentId">
                </div>
            </div>

            <div class="form-check pt-4">
                <input class="form-check-input" id="typeEncrypted" type="radio" value="encrypted" v-model="type" />
                <label class="form-check-label" for="typeEncrypted">Encrypted Message</label>
            </div>
            <div v-if="type === 'encrypted'">
                <div class="form-check">
                    <label class="form-check-label">Message:</label>
                    <input class="form-control" type="text" v-model="dataEncrypted" :disabled="!!paymentId">
                </div>
                <div class="form-check">
                    <label class="form-check-label">Address to encrypt:</label>

                    <div :class="`${selectedDestinationToEncrypt ? 'destination-row' : '' }`" >

                        <account-identicon v-if="selectedDestinationToEncrypt" :public-key="selectedDestinationToEncrypt.publicKey" size="30" outer-size="8" :version="selectedDestinationToEncrypt.version" />
                        <select :class="`form-select`" v-model="selectedDestinationToEncrypt">
                            <option v-for="(destination, id) in destinations"
                                    :key="`selected-address-${id}`"
                                    :value="destination.publicKey ? destination : null"
                                    :class="`${destination.publicKey ? '' : 'fs-error'}`">
                                <template v-if="destination.publicKey">
                                    {{destination.addressEncoded}}
                                </template>
                                <template v-else>
                                    Public Key is missing - {{destination.addressEncoded}}
                                </template>
                            </option>
                        </select>

                    </div>
                </div>
            </div>

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
        paymentId: {default: null},
    },

    data(){
        return {
            error: '',
            type: "public",
            data: '',
            dataEncrypted: '',
            selectedDestinationToEncrypt: null,
        }
    },

    computed:{

    },

    watch: {

        paymentId( to, from ){
            if (to){
                this.data = to
                this.dataEncrypted = to
            } else {
                if (this.data === from) this.data = ""
                if (this.dataEncrypted === from) this.dataEncrypted = ""
            }
        },

        type (to, from) {
            return this.$emit('changed', {
                type: to,
                data: (to === 'public') ? this.data : this.dataEncrypted,
            });
        },

        data (to, from) {
            return this.$emit('changed', { data: to, });
        },

        dataEncrypted (to, from) {
            return this.$emit('changed', { data: to, });
        },

    },

}
</script>


<style scoped>
    .extra-message-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-column-gap: 10px;
    }
    .identicon {
        grid-template-columns: 50px 1fr 1fr;
    }
</style>
