import BaseConsensus from "./consensus-base";

import consts from "consts/consts"

class Consensus extends BaseConsensus{

    async processBlockchain(data){

        data = JSON.parse(data)

        this._data.end = data.end;
        this._data.hash = data.hash;
        this._data.prevHash = data.prevHash;

        this.emit('consensus/blockchain-info-updated', this._data );
        await this.downloadBlocksHashes()

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

    _includeBlock(blk){

        this.emit('consensus/block-downloaded', blk );
        this._data.blocks[blk.height] = blk;
        this._data.blocksByHash[blk.hash] = blk;

        const data = {};
        for (const tx of blk.txs) {
            tx.__extra = {
                height: blk.height,
                timestamp: blk.timestamp,
            };
            this._data.transactions[tx.bloom.hash] = tx;
            data[tx.bloom.hash] = tx;
        }
        this.emit('consensus/tx-downloaded', {transactions: data} );

    }

    getBlockByHash(hash){

        if (this._data.blocks[hash]) return this._data.blocksByHash[hash];
        if (this._promises.blocks[hash]) return this._promises.blocks[hash];

        return this._promises.blocks[hash] = new Promise( async (resolve, reject) => {
            try{

                const blockData = await PandoraPay.network.getNetworkBlockComplete( hash );
                if (!blockData) throw Error("Block was not received")

                const blk = JSON.parse(blockData)
                if (blk.bloom.hash !== hash) throw Error("Block hash was not matching")

                await this._includeBlock( blk );
                resolve(blk);

            }catch(err){
                this.emit('consensus/error', "Error getting block" );
                reject(err);
            }finally{
                delete this._promises.blocks[hash];
            }

        })
    }

    getBlock(height){

        if (typeof height === "string")
            height = Number.parseInt(height)

        if (this._data.blocks[height]) return this._data.blocks[height];

        return this._promises.blocks[height] = new Promise( async (resolve, reject) => {

            try{
                const blockData = await PandoraPay.network.getNetworkBlockComplete( height );
                if (!blockData) throw Error("Block was not received")

                const blk = JSON.parse(blockData)
                if (blk.height !== height) throw Error("Block height was not matching")


                await this._includeBlock( blk );
                resolve(blk);
            }catch(err){
                reject(err);
            }finally{
                delete this._promises.blocks[height];
            }

        });

    }

    async getTransactionByHash(hash, isPending = false ){

        let tx = this._data.transactions[hash] || this._promises.transactions[hash];
        if (tx){
            tx = await tx;
            if ((isPending && !tx.__extra.height ) || (!isPending && tx.__extra.height ))
                return tx;
        }

        return this._promises.transactions[hash] = new Promise( async (resolve, reject ) => {

            try{

                const txData = await PandoraPay.network.getNetworkTransaction( hash );
                if (!txData) throw Error("tx fetch failed"); //disconnected

                const txJSON = JSON.parse(txData)
                const tx = txJSON.tx

                if (tx.bloom.hash !== hash ) throw Error("Transaction hash is invalid");

                tx.__extra = {
                    mempool: txJSON.mempool,
                };


                const data = {};
                data[hash] = tx;

                this.emit('consensus/tx-downloaded', {transactions: data} );

                this._data.transactions[hash] = tx;
                resolve(tx);
            }catch(err){
                this.emit('consensus/error', "Error getting block" );
                reject(err);
            } finally{
                delete this._promises.transactions[hash];
            }
        } );
    }

    getTransaction(height){

        if (typeof height === "string")
            height = Number.parseInt(height)

        let tx = this._data.transactions[height] || this._promises.transactions[height];
        if (tx){
            return tx;
        }

        return this._promises.transactions[height] = new Promise( async (resolve, reject ) => {

            try{

                const txData = await PandoraPay.network.getNetworkTransaction( height );
                if (!txData) throw Error("tx fetch failed"); //disconnected

                const txJSON = JSON.parse(txData)
                const tx = txJSON.tx

                tx.__extra = {
                    mempool: txJSON.mempool,
                };

                const data = {};
                data[tx.bloom.hash] = tx;

                this.emit('consensus/tx-downloaded', {transactions: data} );

                this._data.transactions[tx.bloom.hash] = tx;
                resolve(tx);
            }catch(err){
                this.emit('consensus/error', "Error getting block" );
                reject(err);
            } finally{
                delete this._promises.transactions[height];
            }
        } );

    }

}

export default new Consensus({});
