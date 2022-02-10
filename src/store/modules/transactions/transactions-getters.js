import StringHelper from "../../../utils/string-helper";

export default {

    getTxVersionText: state => txVersion => {
        if (txVersion.eq(PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE) ) return "Simple"
        if (txVersion.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER ) ) return "Zether"
    },

    getTxVersionBadgeColor: state => txVersion => {
        return StringHelper.badgeColors(txVersion.toNumber() )
    },

    getTxScriptTextShort: state => (txVersion, txScript)=> {

        if (txVersion.eq(PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE) ){
            if (txScript.eq(PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UNSTAKE) ) return "unstake"
            if (txScript.eq( PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UPDATE_DELEGATE) ) return "redelegate"
            if (txScript.eq( PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UPDATE_ASSET_FEE_LIQUIDITY )) return "liquidity"
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

    getTxScriptText: state => (txVersion, txScript)=> {

        if (txVersion.eq( PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE) ){
            if (txScript.eq( PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UNSTAKE) ) return "unstake"
            if (txScript.eq( PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UPDATE_DELEGATE) ) return "update delegate"
            if (txScript.eq( PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UPDATE_ASSET_FEE_LIQUIDITY )) return "asset liquidity"
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

    getTxScriptBadgeColor: state => (txVersion, txScript) => {
        return StringHelper.badgeColors(txVersion.toNumber()*10 + txScript.toNumber())
    },

}