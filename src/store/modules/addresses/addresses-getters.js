export default {

    addressesContains: (state)=>(tx)=>{

        for (let i=0; i < tx.vin.length; i++)
            for (const address in state.list)
                if ( state.list[address].publicKey === tx.vin[i].publicKey.toString("hex") ) return true;


        for (let i=0; i < tx.vout.length; i++)
            for (const address in state.list)
                if ( state.list[address].publicKeyHash === tx.vout[i].publicKeyHash.toString("hex") ) return true;

    },

}