const {TransactionTypeEnum} = global.cryptography.transactions;

export default {

    addressesContains: (state)=>(tx)=>{

        if (tx.script === TransactionTypeEnum.PUBLIC_TRANSACTION ||
            tx.script === TransactionTypeEnum.TX_SCRIPT_DELEGATE_STAKE_TRANSACTION ||
            tx.script === TransactionTypeEnum.TX_SCRIPT_TOKEN_CREATE_TRANSACTION ||
            tx.script === TransactionTypeEnum.TX_SCRIPT_TOKEN_UPDATE_SUPPLY_TRANSACTION ) return true;

        for (let i=0; i < tx.vin.length; i++)
            for (const address in state.list)
                if ( state.list[address].publicKey === tx.vin[i].publicKey.toString("hex") ) return true;

        for (let i = 0; i < tx.vout.length; i++)
            for (const address in state.list)
                if (state.list[address].publicKeyHash === tx.vout[i].publicKeyHash.toString("hex")) return true;

    },

}