import StringHelper from "../../../utils/string-helper";

export default {

    getTxScriptTextShort: (state) => (txVersion, txScript)=> {

        if (txVersion.eq(PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE) ){
            if (txScript.eq(PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UNSTAKE) ) return "unstake"
            if (txScript.eq( PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UPDATE_DELEGATE) ) return "redelegate"
            return "simple"
        }else if (txVersion.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER ) ){
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_TRANSFER) ) return "transfer"
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_DELEGATE_STAKE) ) return "delegate"
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_CLAIM) ) return "claim"
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_ASSET_CREATE))  return "asset"
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_ASSET_SUPPLY_INCREASE) ) return "asset"
            return "zether"
        }
    },

    getTxScriptText: (state) => (txVersion, txScript)=> {

        if (txVersion.eq( PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE) ){
            if (txScript.eq( PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UNSTAKE) ) return "unstake"
            if (txScript.eq( PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UPDATE_DELEGATE) ) return "update delegate"
            return "simple"
        }else if (txVersion.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER ) ){
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_TRANSFER) ) return "private transfer"
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_DELEGATE_STAKE) ) return "private delegate"
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_CLAIM) ) return "private claim"
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_ASSET_CREATE) ) return "private asset create"
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_ASSET_SUPPLY_INCREASE) ) return "private asset supply increase"
            return "zether"
        }
    },

    getTxScriptBadgeColor: (state) => (txVersion, txScript)=> {
        return StringHelper.badgeColors(txVersion.toNumber()*10 + txScript.toNumber())
    },

}