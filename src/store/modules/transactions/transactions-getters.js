import StringHelper from "../../../utils/string-helper";

export default {

    getTxScriptTextShort: (state) => (txVersion, txScript)=> {
        if (txVersion === PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE){
            if (txScript === PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UNSTAKE ) return "unstake"
            if (txScript === PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UPDATE_DELEGATE ) return "redelegate"
            return "simple"
        }else if (txVersion === PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER ){
            if (txScript === PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_TRANSFER) return "transfer"
            if (txScript === PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_DELEGATE_STAKE) return "claim"
            if (txScript === PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_CLAIM_STAKE) return "claim"
            return "zether"
        }
    },

    getTxScriptText: (state) => (txVersion, txScript)=> {
        if (txVersion === PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE){
            if (txScript === PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UNSTAKE ) return "unstake"
            if (txScript === PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UPDATE_DELEGATE ) return "update delegate"
            return "simple"
        }else if (txVersion === PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER ){
            if (txScript === PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_TRANSFER) return "private transfer"
            if (txScript === PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_DELEGATE_STAKE) return "private delegate"
            if (txScript === PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_CLAIM_STAKE) return "private claim"
            return "zether"
        }
    },

    getTxScriptBadgeColor: (state) => (txVersion, txScript)=> {
        return StringHelper.badgeColors(txVersion*10 + txScript)
    },

}