const {scriptType} = PandoraPay.enums.transactions.transactionSimple;

export default {

    addressesContains: (state)=>(tx)=>{

        if (tx.base.txScript === scriptType.SCRIPT_NORMAL ||
            tx.base.txScript === scriptType.SCRIPT_UNSTAKE ||
            tx.base.txScript === scriptType.SCRIPT_WITHDRAW ||
            tx.base.txScript === scriptType.SCRIPT_DELEGATE ) return true;

        for (const vin of tx.base.vin )
            for (const address in state.list)
                if ( state.list[address].publicKey === vin.bloom.publicKey ) return true;

        for (const vout of tx.base.vout)
            for (const address in state.list)
                if (state.list[address].publicKeyHash === vout.publicKeyHash ) return true;

    },

}
