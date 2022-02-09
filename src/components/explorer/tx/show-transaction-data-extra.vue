<template>
    <div>
        <template v-if="dataVersion.eq( PandoraPay.enums.transactions.TransactionDataVersion.TX_DATA_PLAIN_TEXT)">
            <span class="text-truncate">{{dataAscii}}</span>
        </template>
        <template v-else-if="dataVersion.eq( PandoraPay.enums.transactions.TransactionDataVersion.TX_DATA_ENCRYPTED)">

            <span v-if="dataDecryptedError" class="text-danger text-truncate">
                {{dataDecryptedError}}
            </span>
            <span class="text-truncate" v-else>
                {{dataDecrypted}}
            </span>

        </template>
    </div>
</template>

<script>
import LoadingButton from "src/components/utils/loading-button"
export default {

    components: {LoadingButton},

    props:{
        dataVersion: {default: 0},
        data: {default: ""},
        dataDecrypted: {default: ""},
        dataDecryptedError: {default: ""}
    },

    computed: {
        PandoraPay: () => PandoraPay,

        dataAscii(){
            if (!this.data) return ""
            return Buffer.from(this.data, "hex").toString()
        }
    }

}
</script>

<style scoped>

</style>