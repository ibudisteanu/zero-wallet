const {scriptType} = PandoraPay.enums.transactions.transactionSimple;

export default {

    addressesContains: (state)=>(tx)=>{

        if (tx.txScript === scriptType.SCRIPT_NORMAL ||
            tx.txScript === scriptType.SCRIPT_UNSTAKE ||
            tx.txScript === scriptType.SCRIPT_WITHDRAW ||
            tx.txScript === scriptType.SCRIPT_DELEGATE_STAKE ) return true;

        for (const vin of tx.vin )
            for (const address in state.list)
                if ( state.list[address].publicKey === vin.publicKey ) return true;


    },

}
