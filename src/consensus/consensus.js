import BaseConsensus from "./consensus-base";

import consts from "consts/consts"

class Consensus extends BaseConsensus{

    processBlockchain(data){

        data = JSON.parse(data)

        this._data.end = data.end;
        this._data.hash = data.hash;
        this._data.prevHash = data.prevHash;

        this.emit('consensus/blockchain-info-updated', this._data );
        this.downloadBlocksHashes()

    }

    async downloadBlocksHashes(starting = this.starting, ending = this.ending-1 ){

        let i, done = false;
        for (i = ending; i >= starting && !done ; i-- ){

            const blockInfoData = await PandoraPay.network.getNetworkBlockInfo( i );
            const blockInfo = JSON.parse(blockInfoData)

            if (!blockInfo || !blockInfo.hash){
                this.emit('consensus/error', "Error getting block info" );
                return
            }

            blockInfo.height = i

            if (this._data.blocksInfo[i] && this._data.blocksInfo[i].hash === blockInfo.hash ){
                done = true;
                continue
            }

            if (!this._data.blocksInfo[i] || !this._data.blocksInfo[i].hash === blockInfo.hash ){

                if (this._data.blocksInfo[i] && this._data.blocksInfo[i].hash !== blockInfo.hash ){
                    this.emit('consensus/block-deleted', {hash: blockInfo.hash, height: i} );
                }

                this._data.blocksInfo[i] = blockInfo;
                this.emit('consensus/block-info-downloaded', blockInfo );

            }

        }

    }

    stopDownloadPendingTransactions(){

    }

}

export default new Consensus({});
