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
            if (txScript.eq( PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UPDATE_ASSET_FEE_LIQUIDITY )) return "liquidity"
            if (txScript.eq( PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_RESOLUTION_CONDITIONAL_PAYMENT )) return "resolution"
            return "simple"
        }else if (txVersion.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER ) ){
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_TRANSFER) ) return "transfer"
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_STAKING) ) return "staking"
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_STAKING_REWARD) ) return "reward"
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_SPEND))  return "spend"
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_ASSET_CREATE))  return "asset"
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_ASSET_SUPPLY_INCREASE) ) return "asset"
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_PLAIN_ACCOUNT_FUND) ) return "fund"
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_CONDITIONAL_PAYMENT) ) return "cond"
            return "zether"
        }
    },

    getTxScriptText: state => (txVersion, txScript)=> {

        if (txVersion.eq( PandoraPay.enums.transactions.TransactionVersion.TX_SIMPLE) ){
            if (txScript.eq( PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_UPDATE_ASSET_FEE_LIQUIDITY )) return "public asset liquidity"
            if (txScript.eq( PandoraPay.enums.transactions.transactionSimple.ScriptType.SCRIPT_RESOLUTION_CONDITIONAL_PAYMENT )) return "public resolution conditional payment"
            return "simple"
        }else if (txVersion.eq( PandoraPay.enums.transactions.TransactionVersion.TX_ZETHER ) ){
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_TRANSFER) ) return "private transfer"
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_STAKING) ) return "private staking"
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_STAKING_REWARD) ) return "private reward"
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_SPEND) ) return "private spend"
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_ASSET_CREATE) ) return "private asset create"
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_ASSET_SUPPLY_INCREASE) ) return "private asset supply increase"
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_PLAIN_ACCOUNT_FUND) ) return "private fund"
            if (txScript.eq( PandoraPay.enums.transactions.transactionZether.PayloadScriptType.SCRIPT_CONDITIONAL_PAYMENT) ) return "private conditional payment"
            return "zether"
        }
    },

    getTxScriptBadgeColor: state => (txVersion, txScript) => {
        return StringHelper.badgeColors(txVersion.toNumber()*10 + txScript.toNumber())
    },

    printEncryptedTxMemo: state => (message) => {
        const b = Buffer.from(message, 'base64')
        let i
        for (i=b.length-1; i>0; i--)
            if (b[i] !== 0) break
        return b.slice(0, i+1).toString()
    }

}