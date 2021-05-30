const {scriptType} = PandoraPay.enums.transactions.transactionSimple;

export default {

    addressesContains: (state)=>(tx)=>{

        if (tx.script === scriptType.SCRIPT_NORMAL ||
            tx.script === scriptType.SCRIPT_UNSTAKE ||
            tx.script === scriptType.SCRIPT_WITHDRAW ||
            tx.script === scriptType.SCRIPT_DELEGATE ) return true;

        for (let i=0; i < tx.vin.length; i++)
            for (const address in state.list)
                if ( state.list[address].publicKey === tx.vin[i].publicKey.toString("hex") ) return true;

        for (let i = 0; i < tx.vout.length; i++)
            for (const address in state.list)
                if (state.list[address].publicKeyHash === tx.vout[i].publicKeyHash.toString("hex")) return true;

    },

}
