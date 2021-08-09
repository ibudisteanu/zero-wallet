<template>
    <div>

        <div class="col">
            <div class="form-check">
                <input class="form-check-input" id="typePublic" type="radio" value="public" v-model="type" />
                <label class="form-check-label" for="typePublic">Public Message</label>

                <input class="form-control" type="text" v-model="data" v-if="type === 'public'">
            </div>

            <div class="form-check pt-4">
                <input class="form-check-input" id="typeEncrypted" type="radio" value="encrypted" v-model="type" />
                <label class="form-check-label" for="typeEncrypted">Encrypted Message</label>

                <input class="form-control" type="text" v-model="dataEncrypted" v-if="type === 'encrypted'">
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
    },

    data(){
        return {
            error: '',
            type: "public",
            data: '',
            dataEncrypted: '',
        }
    },

    computed:{


    },

    watch: {

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
