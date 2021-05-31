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

            const blockInfoData = await PandoraPay.network.getNetworkBlockInfo( i, "" );
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

    _includeBlock(block){
        this.emit('consensus/block-downloaded', block );
        this._data.blocks[block.height] = block;
        this._data.blocksByHash[block.hash] = block;
    }

    getBlockByHash(hash){

        if (this._data.blocks[hash]) return this._data.blocksByHash[hash];
        if (this._promises.blocks[hash]) return this._promises.blocks[hash];

        this._promises.blocks[hash] = new Promise( async (resolve, reject) => {
            try{

                const blockData = await PandoraPay.network.getNetworkBlockComplete( 0, hash);
                if (!blockData) throw Error("Block was not received")

                const block = JSON.parse(blockData)

                console.log("block", block)

                await this._includeBlock( block );
                resolve(block);

            }catch(err){
                this.emit('consensus/error', "Error getting block" );
                reject(err);
            }finally{
                delete this._promises.blocks[hash];
            }

        })
    }

    getBlock(){

    }

}

export default new Consensus({});
