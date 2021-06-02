const {scriptType} = PandoraPay.enums.transactions.transactionSimple;

export default {

    addressesContains: (state)=>(tx)=>{

        if (tx.txBase.txScript === scriptType.SCRIPT_NORMAL ||
            tx.txBase.txScript === scriptType.SCRIPT_UNSTAKE ||
            tx.txBase.txScript === scriptType.SCRIPT_WITHDRAW ||
            tx.txBase.txScript === scriptType.SCRIPT_DELEGATE ) return true;

        for (const vin of tx.txBase.vin )
            for (const address in state.list)
                if ( state.list[address].publicKey === vin.bloom.publicKey ) return true;

        for (const vout of tx.txBase.vout)
            for (const address in state.list)
                if (state.list[address].publicKeyHash === vout.publicKeyHash ) return true;

    },

}
