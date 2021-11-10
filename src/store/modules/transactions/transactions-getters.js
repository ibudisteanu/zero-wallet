import StringHelper from "../../../utils/string-helper";

export default {

    getTxScriptTextShort: (state) => (txVersion, txScript)=> {
        if (txVersion === PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE){
            if (txScript === PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UNSTAKE ) return "unstake"
            if (txScript === PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UPDATE_DELEGATE ) return "redelegate"
            return "simple"
        }else if (txVersion === PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER ){
            if (txScript === PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_TRANSFER) return "transfer"
            if (txScript === PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_DELEGATE_STAKE) return "delegate"
            if (txScript === PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_CLAIM) return "claim"
            if (txScript === PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_ASSET_CREATE) return "asset"
            if (txScript === PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_ASSET_SUPPLY_INCREASE) return "asset"
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
            if (txScript === PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_CLAIM) return "private claim"
            if (txScript === PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_ASSET_CREATE) return "private asset create"
            if (txScript === PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_ASSET_SUPPLY_INCREASE) return "private asset supply increase"
            return "zether"
        }
    },

    getTxScriptBadgeColor: (state) => (txVersion, txScript)=> {
        return StringHelper.badgeColors(txVersion*10 + txScript)
    },

}