import BaseConsensus from "./consensus-base";
import consts from "consts/consts"

class Consensus extends BaseConsensus{

    async transactionsNotification( publicKeyHash, txHash, extraInfo ) {

        const accountsTxsPosition = this._data.accountsTxsPosition[publicKeyHash]
        this.emit('consensus/account-txs-update-notification', {publicKeyHash, txHash, extraInfo, accountsTxsPosition})

        if ( extraInfo.inserted && ( !accountsTxsPosition || (extraInfo.txsCount > accountsTxsPosition.starting && extraInfo.txsCount < accountsTxsPosition.ending) ) )
            await this.getTransactionByHash(txHash)

    }

    async getTransactionByHash(hash ){
        //remove
    }

}

export default new Consensus({});
