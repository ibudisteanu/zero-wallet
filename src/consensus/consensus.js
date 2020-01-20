import BaseConsensus from "./consensus-base";

const {client} = global.blockchain.sockets.client;
const {BasicSocket} = global.blockchain.sockets.basic;
const {Helper} = global.protocol.helpers;

const {NodeConsensusTypeEnum} = global.blockchain.sockets.schemas.types;
const {BigNumber} = global.protocol.utils;
const {MarshalData} = global.protocol.marshal;

const {Block} = global.blockchain.blockchain.block;

class Consensus extends BaseConsensus{

    constructor(settings) {

        super(settings);

        this._settings.address = "http://127.0.0.1:4006";

        this._data = {

            start: 0,
            end: 0,
            hash: Buffer.alloc(32),
            kernelHash: Buffer.alloc(32),
            prevHash: Buffer.alloc(32),
            prevKernelHash: Buffer.alloc(32),
            chainwork: BigNumber(0),

            blocksInfo:{

            },

            blocks: {

            },

            blocksByHash:{

            },

            transactions : {

            },

            accounts: {

            },

        };

        this._downloadPendingTransactionsEnabled = false;

    }

    async _started(){

        const sock = client( this._settings.address, {

            reconnection: true,
            maxHttpBufferSize: global.apacache._scope.argv.networkSettings.networkMaxSize,
            query: {
                handshake: JSON.stringify({
                    short: global.apacache._scope.argv.settings.applicationShort,

                    build: global.apacache._scope.argv.settings.buildVersion,

                    net: {
                        type: global.apacache._scope.argv.settings.networkType,
                    },

                    address: '',
                    consensus: NodeConsensusTypeEnum.CONSENSUS_RPC
                })
            }
        });

        this._client = new BasicSocket( global.apacache._scope, this._settings.address, sock, undefined );

        [ "connect", "disconnect"  ].map( fct => this._client[fct] = sock[fct].bind( sock ) );
        [ "emit", "on","once" ].map( fct => this._client['_'+fct] = sock[fct].bind( sock ) );

        this._client.on("connect", ()=> this.status = "online" );
        this._client.on("disconnect", ()=> this.status = "offline" );

        this._client.once("handshake", handshake =>{

            console.log("handshake.short", handshake.short);

            if (handshake.short === global.apacache._scope.argv.settings.applicationShort) {
                this.status = "syncing";
                this._client.emit("ready!", "go!");
            }
            else
                this._client.close();
        });

        this._client.on("blockchain-protocol/new-block", this._processBlockchainNewBlock.bind(this) );

        this._client.on("connect", ()=>{

            this.getBlockchain();
            this._initPromiseResolve(true);

        });

    }

    getBlockchain(){

        if (this._client)
            return this._client.emit("blockchain/get-info", undefined, this._processBlockchain.bind(this) );
    }

    async _processBlockchainNewBlock(data) {

        await this._processBlockchainInfo(data);

    }

    async _processBlockchain(data){

        await this._processBlockchainInfo(data);

        this.status = "sync";

    }

    async _processBlockchainInfo(data){

        this._data.end = data.blocks;
        this._data.start = data.start;
        this._data.hash = data.hash;
        this._data.prevHash = data.prevHash;
        this._data.prevKernelHash = data.prevKernelHash;

        this._data.chainwork = MarshalData.decompressBigNumber( data.chainwork );

        this.emit('consensus/blockchain-info-updated', this._data );

        await this._downloadLastBlocksHashes();

        await this._downloadBalances();

        await this._downloadPendingTransactions();

    }

    async _downloadLastBlocksHashes(){

        const starting = this.starting;
        const ending =  this.ending-1;

        let i, done = false;
        for (i = ending; i >= starting && !done ; i-- ){

            const blockInfo = await this._client.emitAsync("blockchain/get-block-info", {index: i}, 0);

            if(!blockInfo) return; //disconnected

            blockInfo.hash = Buffer.from(blockInfo.hash);
            blockInfo.kernelHash = Buffer.from(blockInfo.kernelHash);

            if (!this._data.blocksInfo[i] || !this._data.blocksInfo[i].hash.equals(blockInfo.hash)){

                if (this._data.blocksInfo[i] && !this._data.blocksInfo[i].hash.equals(blockInfo.hash)){

                    this.emit('consensus/block-deleted', {hash: blockInfo.hash, height: i} );

                    delete this._data.blocks[i];
                    delete this._data.blocksByHash[blockInfo.hash.toString("hex")];
                    await this.getBlock(i);
                }

                this._data.blocksInfo[i] = blockInfo;
                this.emit('consensus/block-info-downloaded', blockInfo );

            }else {
                if (this._data.blocksInfo[i] && this._data.blocksInfo[i].hash.equals( blockInfo.hash) )
                    done = true;

            }
        }

        return true;

    }

    async _downloadBalances(){

        for (const account in this._data.accounts){

            const balances = await this._client.emitAsync("account/get-balance", {account }, 0);
            const nonce = await this._client.emitAsync("account/get-nonce", {account }, 0);

            const address = global.apacache._scope.cryptography.addressValidator.validateAddress( account );
            const publicKeyHash = address.publicKeyHash;

            //remove old balance
            const balancesOld = await global.apacache.mainChain.data.accountTree.getBalances(publicKeyHash);
            const nonceOld = await global.apacache.mainChain.data.accountTree.getNonce(publicKeyHash);

            if (balancesOld)
                for (const currencyToken in balancesOld)
                    await global.apacache.mainChain.data.accountTree.updateBalance( publicKeyHash, - balancesOld[currencyToken], currencyToken, );

            if (nonceOld)
                await global.apacache.mainChain.data.accountTree.updateNonce( publicKeyHash, - nonceOld, );

            //update with new balance
            if (balances)
                for (const currencyToken in balances)
                    await global.apacache.mainChain.data.accountTree.updateBalance(publicKeyHash, balances[currencyToken], currencyToken,);

            if (nonce)
                await global.apacache.mainChain.data.accountTree.updateNonce(publicKeyHash, nonce,);

            this.emit('consensus/account-update', { account, balances, nonce  } );

        }

    }

    async subscribeAccounts( accounts ){

        this._data.accounts = {};

        accounts.map (account => {
            this._data.accounts[account] = true;
        });

    }

    async _downloadPendingTransactions(){

        if (!this._downloadPendingTransactionsEnabled) return;

        const transactions = await this._client.emitAsync("mem-pool/content", { }, 0);

        if (!transactions) return ;

        this.emit('consensus/pending-transactions', transactions );

    }

    async startDownloadPendingTransactions(){

        if (!this._downloadPendingTransactionsEnabled)
            this._downloadPendingTransactionsEnabled = true;

        this._downloadPendingTransactions();
    }

    async stopDownloadPendingTransactions(){

        if (this._downloadPendingTransactionsEnabled)
            this._downloadPendingTransactionsEnabled = false;
    }

    async _stopped(){

    }


    async getBlockByHash(hash){

        if (this._data.blocks[hash]) return this._data.blocksByHash[hash];

        const blockData = await this._client.emitAsync("blockchain/get-block", { hash, type: "buffer"}, 0  );
        if (!blockData) return; //disconnected

        const block = new Block( {
            ...global.apacache._scope,
            chain: global.apacache._scope.mainChain
        }, undefined, Buffer.from(blockData) );


        await this._includeBlock(block);

        return block;


    }

    async getBlock(height){

        if (this._data.blocks[height]) return this._data.blocks[height];

        const blockData = await this._client.emitAsync("blockchain/get-block-by-height", {index: height, type: "buffer"}, 0  );
        if (!blockData) return; //disconnected

        const block = new Block({
            ...global.apacache._scope,
            chain: global.apacache._scope.mainChain
        }, undefined, Buffer.from(blockData));

        await this._includeBlock(block);

        return block;

    }

    async _includeBlock(block){

        this.emit('consensus/block-downloaded', block );

        this._data.blocks[block.height] = block;
        this._data.blocksByHash[block.hash().toString("hex")] = block;

        const data = {};
        const txs = await block.getTransactions();
        for (const tx of txs) {
            tx.__extra = {
                height: block.height,
            };
            this._data.transactions[tx.hash().toString("hex")] = tx;
            data[tx.hash().toString("hex")] = tx;
        }
        this.emit('consensus/tx-downloaded', data );

    }

    async getTransactionByHash(hash){

        console.log("hash", hash);

        if (this._data.transactions[hash]) return this._data.transactions[hash];

        const txData = await this._client.emitAsync("transactions/get-raw-transaction", { hash }, 0  );
        if (!txData) return; //disconnected

        const tx = global.apacache._scope.mainChain.transactionsValidator.validateTx( txData.tx );

        tx.__extra = {
            height: txData.block,
        };

        console.log("tx", tx);

        const data = {};
        data[hash] = tx;

        this.emit('consensus/tx-downloaded', data );

        return tx;
    }

    async getTransactionByHeight(blockHeight){

    }


    get starting(){
        return Math.max(0 , this._starting || this._data.end - 15);
    }

    get ending(){
        return this._ending || this._data.end;
    }

}

export default new Consensus({});