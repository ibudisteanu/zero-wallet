import BaseConsensus from "./consensus-base";
import consts from "consts/consts"

class Consensus extends BaseConsensus{

    async processBlockchain(data) {

        data = JSON.parse(data)

        this._data.end = data.end;
        this._data.hash = data.hash;
        this._data.prevHash = data.prevHash;

        this.emit('consensus/blockchain-info-updated', this._data);

        if (this.status === "online") {
            this.status = "sync"
        }

        await this.downloadBlocksHashes( this.ending - consts.blocksInfoPagination )

    }


    async downloadBlocksHashes( starting ){

        starting = Math.max(0, starting )
        const ending = Math.min( starting + consts.blocksInfoPagination -1, this.ending-1 )

        console.log(starting, ending)

        const newBlocksInfo = {}

        for (let i = ending; i >= starting ; i-- ){

            const blockInfoData = await PandoraPay.network.getNetworkBlockInfo( i );
            const blockInfo = JSON.parse(blockInfoData)

            if (!blockInfo || !blockInfo.hash)
                throw "Error getting block info"

            blockInfo.height = i
            if (this._data.blocksInfo[i] && this._data.blocksInfo[i].hash === blockInfo.hash )
                break

            if (!this._data.blocksInfo[i] || this._data.blocksInfo[i].hash !== blockInfo.hash ){
                this._data.blocksInfo[i] = blockInfo;
                newBlocksInfo[i] = blockInfo
            }

        }

        this.emit('consensus/blocks-info-downloaded', newBlocksInfo );

        const deletedBlocksInfo = []
        for (const key in this._data.blocksInfo){
            const height = Number.parseInt(key)
            if (height < starting || height > ending && height) {
                deletedBlocksInfo.push(key)
                delete this._data.blocksInfo[key]
            }
        }
        if (deletedBlocksInfo.length > 0)
            this.emit('consensus/blocks-info-delete', deletedBlocksInfo);

    }

    async unsubscribeAccount(account){

    }

    async subscribeAccount(publicKeyHash){

        if (this._promises.accounts[publicKeyHash]) return this._promises.accounts[publicKeyHash];

        return this._promises.accounts[publicKeyHash] = new Promise( async (resolve, reject) => {

            let accountData = await PandoraPay.network.subscribeNetworkAccount( "", publicKeyHash );
            if (!accountData) {
                this.emit('consensus/account-transparent-update', { publicKeyHash , account: null  } )
                return
            }

            try{
                const account = JSON.parse(accountData)
                console.log("accountData", account)

                this._subscribed[publicKeyHash] = account
                this.emit('consensus/account-transparent-update', { publicKeyHash, account  } );

                resolve(account)
            }catch(err){
                reject(err)
            }finally{
                delete this._promises.accounts[publicKeyHash];
            }

        })

    }

    async setAccounts( accounts ){

        const exists = {}

        for (const account in accounts) {

            exists[account] = true

            if (!this._data.accounts[account]){
                this._data.accounts[account] = {
                    publicKeyHash: accounts[account].publicKeyHash,
                }
                await this.subscribeAccount(accounts[account].publicKeyHash);
            }

        }

        for (const account in this._data.accounts){
            if (!exists[account]){
                await this.unsubscribeAccount(this._data.accounts[account].publicKeyHash)
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
                reject(err);
            } finally{
                delete this._promises.transactions[height];
            }
        } );

    }

}

export default new Consensus({});
