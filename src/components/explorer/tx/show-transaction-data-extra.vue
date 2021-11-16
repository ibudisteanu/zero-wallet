<template>
    <div>
        <template v-if="dataVersion === PandoraPay.enums.transactions.TransactionDataVersion.TX_DATA_PLAIN_TEXT">
            {{data}}
        </template>
        <template v-else-if="dataVersion === PandoraPay.enums.transactions.TransactionDataVersion.TX_DATA_ENCRYPTED">

            <span v-if="dataDecryptedError" class="text-danger">
                {{dataDecryptedError}}
            </span>
            <span v-else>
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
    }

}
</script>

<style scoped>

</style>