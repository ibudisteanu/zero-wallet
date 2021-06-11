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

        await this.getBlocksInfo( this.ending - consts.blocksInfoPagination )

    }

    async getTokenByHash( hash ){
        if (this._data.tokens[hash]) return this._data.tokens[hash]
        if (this._promises.tokens[hash]) return this._promises.tokens[hash];
        return this._promises.tokens[hash] = new Promise( async (resolve, reject) => {
            try{
                const tokenData = await PandoraPay.network.getNetworkToken(hash);
                const token = JSON.parse(tokenData)

                if (!token ) throw "Error getting block info"

                token.hash = hash
                this._data.tokensInfo[hash] = token;

                this.emit('consensus/token-downloaded', token );

                resolve(token)
            }catch(err){
                reject(err)
            }
            finally{
                delete this._promises.tokens[hash]
            }
        })
    }

    async _getTokenInfo( hash ){

        if (hash === "") hash = PandoraPay.config.coins.NATIVE_TOKEN_FULL_STRING_HEX

        if (this._data.tokensInfo[hash]) return this._data.tokensInfo[hash]
        if (this._promises.tokensInfo[hash]) return this._promises.tokensInfo[hash];
        return this._promises.tokensInfo[hash] = new Promise( async (resolve, reject) => {
            try{

                const tokenInfoData = await PandoraPay.network.getNetworkTokenInfo(hash);
                const tokenInfo = JSON.parse(tokenInfoData)

                if (!tokenInfo ) throw "Error getting block info"

                tokenInfo.hash = hash
                this._data.tokensInfo[hash] = tokenInfo;

                this.emit('consensus/tokenInfo-downloaded', tokenInfo  );

                resolve(tokenInfo)
            }catch(err){
                reject(err)
            }
            finally{
                delete this._promises.tokensInfo[hash]
            }
        })
    }

    async _getBlockInfo( height ){

        if (this._promises.blocksInfo[height]) return this._promises.blocksInfo[height];
        return this._promises.blocksInfo[height] = new Promise( async (resolve, reject) => {

            try{
                const blockInfoData = await PandoraPay.network.getNetworkBlockInfo( height );
                const blockInfo = JSON.parse(blockInfoData)

                if (!blockInfo || !blockInfo.hash)
                    throw "Error getting block info"

                blockInfo.height = height

                this._data.blocksInfo[height] = blockInfo;
                resolve(blockInfo)

            }catch(err){
                reject(err)
            }finally {
                delete this._promises.blocksInfo[height]
            }

        })

    }

    async getBlocksInfo( starting ){

        starting = Math.max(0, starting )
        const ending = Math.min( starting + consts.blocksInfoPagination -1, this.ending-1 )

        console.log(starting, ending)

        const newBlocksInfo = {}

        for (let i = ending; i >= starting ; i-- ){

            let beforeHash
            if (this._data.blocksInfo[i] && this._data.blocksInfo[i].hash )
                beforeHash = this._data.blocksInfo[i].hash

            const blockInfo = await this._getBlockInfo(i)

            if (beforeHash === blockInfo.hash )
                break

            newBlocksInfo[i] = blockInfo

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

    async processAccount(account){

        if (!account) return

        for (const balance of account.balances)
            await this._getTokenInfo(balance.token)

        await this._getTokenInfo("")

    }

    async downloadAccountTxs( publicKeyHash, next = 0 ){
        if (this._promises.accountsTxs[publicKeyHash]) return this._promises.accountsTxs[publicKeyHash];
        return this._promises.accountsTxs[publicKeyHash] = new Promise( async (resolve, reject) => {
            try{
                const out = await PandoraPay.network.getNetworkAccountTxs(publicKeyHash, next);
                const accountTxs = JSON.parse(out)

                this.emit("consensus/account-txs", { publicKeyHash, next, accountTxs })

                if (accountTxs)
                    await Promise.all( accountTxs.txs.map ( txHash =>  this.getTransactionByHash(txHash) ) )

                resolve(accountTxs)
            }catch(err){
                reject(err)
            }finally{
                delete this._promises.accountsTxs[publicKeyHash];
            }
        })
    }

    async _downloadAccount(publicKeyHash){
        if (this._promises.accounts[publicKeyHash]) return this._promises.accounts[publicKeyHash];
        return this._promises.accounts[publicKeyHash] = new Promise( async (resolve, reject) => {
            try{
                const out = await PandoraPay.network.getNetworkAccount(publicKeyHash);
                const account = JSON.parse(out)

                await this.processAccount(account)
                this.emit("consensus/account-transparent-update", { publicKeyHash, account })

                await this.downloadAccountTxs(publicKeyHash, 0)

                resolve(account)
            }catch(err){
                reject(err)
            }finally{
                delete this._promises.accounts[publicKeyHash];
            }
        })
    }

    async unsubscribeAccount(publicKeyHash){

        if (!this._subscribed.accounts[publicKeyHash])
            return false

        console.log("unsubscribeAccount", publicKeyHash)

        if (this._promises.unsubscribed[publicKeyHash]) return this._promises.unsubscribed[publicKeyHash]
        return this._promises.unsubscribed[publicKeyHash] = new Promise( async(resolve, reject)=>{
            try{
                await PandoraPay.network.unsubscribeNetwork( publicKeyHash, PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_ACCOUNT );
                delete this._subscribed.accounts[publicKeyHash]

                resolve(true)
            }catch(err){
                reject(err)
            }finally{
                delete this._promises.unsubscribed[publicKeyHash]
            }
        })

    }

    async subscribeAccount(publicKeyHash){

        if (this._subscribed.accounts[publicKeyHash])
            return this._downloadAccount(publicKeyHash)

        if (this._promises.subscribed.accounts[publicKeyHash]) return this._promises.subscribed.accounts[publicKeyHash];
        return this._promises.subscribed.accounts[publicKeyHash] = new Promise( async (resolve, reject) => {

            try{
                await PandoraPay.network.subscribeNetwork( publicKeyHash, PandoraPay.enums.api.websockets.subscriptionType.SUBSCRIPTION_ACCOUNT );

                const out = await this._downloadAccount(publicKeyHash)
                resolve(out)

                this._subscribed.accounts[publicKeyHash] = true

            }catch(err){
                reject(err)
            }finally{
                delete this._promises.subscribed.accounts[publicKeyHash];
            }

        })
    }

    downloadMempool(start = 0){
        if (this._promises.mempool) return this._promises.mempool
        return this._promises.mempool = new Promise(async (resolve, reject)=>{
            try{
                const data = await PandoraPay.network.getNetworkMempool(start)
                const mempool = JSON.parse(data)
                if (!mempool) throw "Mempool is invalid"

                const hasMore = ( start + mempool.hashes.length ) < mempool.count
                const next = ( start + mempool.hashes.length )

                this.emit("consensus/mem-pool-update", {start, mempool, hasMore, next })

                resolve(true)
            }catch(err){
                reject(err)
            }finally{
                delete (this._promises.mempool)
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
            if (!exists[account])
                await this.unsubscribeAccount(this._data.accounts[account].publicKeyHash)
        }

    }

    _includeBlock(blk){

        this._data.blocksByHeight[blk.height] = blk;
        this._data.blocksByHash[blk.hash] = blk;

        this.emit('consensus/block-downloaded', blk );

        const data = {};
        for (const tx of blk.txs) {
            tx.__extra = {
                blkHeight: blk.height,
                timestamp: blk.timestamp,
            };
            this._data.transactionsByHash[tx.bloom.hash] = tx;
            data[tx.bloom.hash] = tx;
        }
        this.emit('consensus/tx-downloaded', {transactions: data} );

    }

    getBlockByHash(hash){

        if (this._data.blocksByHash[hash]) return this._data.blocksByHash[hash];
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

    getBlockByHeight(height){

        if (typeof height === "string")
            height = Number.parseInt(height)

        if (this._data.blocksByHeight[height]) return this._data.blocksByHeight[height];

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

    _includeTx(txJSON ){

        const tx = txJSON.tx

        tx.__extra = {
            mempool: txJSON.mempool,
        };

        if (txJSON.info) {
            tx.__extra.height = txJSON.info.height
            tx.__extra.blkHeight = txJSON.info.blkHeight
            tx.__extra.timestamp = txJSON.info.timestamp

            this._data.transactionsByHeight[txJSON.info.height] = tx;
        }

        const data = {};
        data[tx.bloom.hash] = tx;

        this._data.transactionsByHash[tx.bloom.hash] = tx;

        this.emit('consensus/tx-downloaded', {transactions: data} );

        return tx
    }

    async getTransactionByHash(hash ){

        if (this._data.transactionsByHash[hash]) return this._data.transactionsByHash[hash];
        if (this._promises.transactions[hash]) return this._promises.transactions[hash];

        console.log("hash", hash)
        return this._promises.transactions[hash] = new Promise( async (resolve, reject ) => {

            try{

                const txData = await PandoraPay.network.getNetworkTransaction( hash );
                if (!txData) throw Error("tx fetch failed"); //disconnected

                resolve(this._includeTx(JSON.parse(txData)));
            }catch(err){
                reject(err);
            } finally{
                delete this._promises.transactions[hash];
            }
        } );
    }

    getTransactionByHeight(height){

        if (typeof height === "string")
            height = Number.parseInt(height)

        if (this._data.transactionsByHeight[height]) return this._data.transactionsByHeight[height];
        if (this._promises.transactions[height]) return this._promises.transactions[height];

        return this._promises.transactions[height] = new Promise( async (resolve, reject ) => {

            try{

                const txData = await PandoraPay.network.getNetworkTransaction( height );
                if (!txData) throw Error("tx fetch failed"); //disconnected

                resolve(this._includeTx(JSON.parse(txData)));

            }catch(err){
                reject(err);
            } finally{
                delete this._promises.transactions[height];
            }
        } );

    }

}

export default new Consensus({});
