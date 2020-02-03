import BaseConsensus from "./consensus-base";

const {client} = global.blockchain.sockets.client;
const {BasicSocket} = global.blockchain.sockets.basic;
const {Helper} = global.kernel.helpers;

const {NodeConsensusTypeEnum} = global.blockchain.sockets.schemas.types;
const {BigNumber} = global.kernel.utils;
const {MarshalData} = global.kernel.marshal;

const {Block} = global.blockchain.blockchain.block;
const {ExchangeOffer} = global.blockchain.exchange;

class Consensus extends BaseConsensus{

    constructor(settings) {

        super(settings);

        this._settings.address = "http://helloworldx.ddns.net:8082";

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

            offers:{

            },


        };

        this._downloadPendingTransactionsEnabled = false;
        this._downloadExchangeOffersEnabled = false;

    }

    async _started(){

        const sock = client( this._settings.address, {

            reconnection: true,
            maxHttpBufferSize: PandoraPay._scope.argv.networkSettings.networkMaxSize,
            query: {
                handshake: JSON.stringify({
                    short: PandoraPay._scope.argv.settings.applicationShort,

                    build: PandoraPay._scope.argv.settings.buildVersion,

                    net: {
                        type: PandoraPay._scope.argv.settings.networkType,
                    },

                    address: '',
                    consensus: NodeConsensusTypeEnum.CONSENSUS_RPC
                })
            }
        });

        this._client = new BasicSocket( PandoraPay._scope, this._settings.address, sock, undefined );

        [ "connect", "disconnect"  ].map( fct => this._client[fct] = sock[fct].bind( sock ) );
        [ "emit", "on","once" ].map( fct => this._client['_'+fct] = sock[fct].bind( sock ) );

        this._client.on("connect", ()=> this.status = "online" );
        this._client.on("disconnect", ()=> this.status = "offline" );

        this._client.once("handshake", handshake =>{

            console.log("handshake.short", handshake.short);

            if (handshake.short === PandoraPay._scope.argv.settings.applicationShort) {
                this.status = "syncing";
                this._client.emit("ready!", "go!");
            }
            else
                this._client.close();
        });

        this._client.on("blockchain-protocol/new-block", this._processBlockchainNewBlock.bind(this) );

        this._client.on("connect", ()=>{

            this.getBlockchain();
            this._downloadGenesis();
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

        await this._downloadAccountsBalances();
        await this._downloadAccountsTransactions();

        await this.downloadPendingTransactions();
        await this.downloadExchangeOffersAll();

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

                    const block = this._data.blocks[i];
                    if (block){
                        const txs = await block.getTransactions();
                        for (const tx of txs) {
                            delete this._data.transactions[tx.hash().toString("hex")];
                            data[tx.hash().toString("hex")] = tx;
                        }
                        this.emit('consensus/tx-deleted', {transactions: data} );
                    }

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

    async downloadNonceIncludingMemPool(account){

        const nonce = await this._client.emitAsync("account/get-nonce-including-mem-pool", { account }, 0);
        return nonce;

    }

    async _downloadAccountsBalances(){

        for (const account in this._data.accounts)
            await this.downloadAccountBalance(account);

    }

    async downloadAccountBalance(account){

        const balances = await this._client.emitAsync("account/get-balance", {account }, 0);
        const nonce = await this._client.emitAsync("account/get-nonce", {account }, 0);

        const address = PandoraPay._scope.cryptography.addressValidator.validateAddress( account );
        const publicKeyHash = address.publicKeyHash;

        //remove old balance
        const balancesOld = await PandoraPay.mainChain.data.accountTree.getBalances(publicKeyHash);
        const nonceOld = await PandoraPay.mainChain.data.accountTree.getNonce(publicKeyHash);

        if (balancesOld)
            for (const currencyToken in balancesOld)
                await PandoraPay.mainChain.data.accountTree.updateBalance( publicKeyHash, - balancesOld[currencyToken], currencyToken, );

        if (nonceOld)
            await PandoraPay.mainChain.data.accountTree.updateNonce( publicKeyHash, - nonceOld, );

        //update with new balance
        if (balances)
            for (const currencyToken in balances)
                await PandoraPay.mainChain.data.accountTree.updateBalance(publicKeyHash, balances[currencyToken], currencyToken,);

        if (nonce)
            await PandoraPay.mainChain.data.accountTree.updateNonce(publicKeyHash, nonce,);

        this.emit('consensus/account-update', { account, balances, nonce  } );

    }

    subscribeAccounts( accounts ){

        this._data.accounts = {};

        accounts.map (account => {
            this._data.accounts[account] = true;
        });

    }

    async _downloadGenesis(){

        const genesis = await this._client.emitAsync("blockchain/genesis", { }, 0);
        console.log("genesis", genesis);

        this._data.genesis = genesis;

        this.emit('consensus/blockchain-info-genesis-updated', genesis );

    }

    async _downloadAccountsTransactions() {

        for (const account in this._data.accounts)
            await this.downloadAccountTransactions(account);

    }

    async downloadAccountTransactions(account) {

        const txCount = await this._client.emitAsync("transactions/account/get-transaction-count", {account }, 0);
        const txCountPending = await this._client.emitAsync("mem-pool/content-count", {account }, 0);

        if (!txCountPending && !txCount) return;

        this.emit('consensus/account-update-tx-count', {account, txCount, txCountPending});

        await this.downloadAccountTransactionsSpecific({account, limit: 10});
        await this.downloadPendingTransactionsSpecific( {account})

    }

    async downloadAccountTransactionsSpecific({account, index, limit} ){

        const data = await this._client.emitAsync("transactions/account/get-transactions-ids", { account, index, limit }, 0);

        if (!data || !data.out) return;

        this.emit('consensus/account-update-txs', {account, txs: data.out, next: data.next, });

        for (const key in data.out)
            this.getTransactionByHash( data.out[key].toString("hex"), false );

    }

    async downloadPendingTransactions( account, index ){

        if (!this._downloadPendingTransactionsEnabled) return;

        const txCount = await this._client.emitAsync("mem-pool/content-count", {account}, 0);
        if (!txCount) return;

        this.emit('consensus/pending-transactions-count', {count: txCount});

        return this.downloadPendingTransactionsSpecific({account, index});
    }

    async downloadPendingTransactionsSpecific( {account, index, limit} ){

        const data = await this._client.emitAsync("mem-pool/content-ids", { account, index }, 0);

        if (!data|| !data.out) return ;

        if (!account)
            this.emit('consensus/pending-transactions', { txs: data.out, next: data.next, clear: index === undefined } );
        else
            this.emit('consensus/account-update-pending-txs', { account, txs: data.out, next: data.next, clear: index === undefined } );

        for (const hash in data.out)
            this.getTransactionByHash(hash, true);

    }

    async downloadExchangeOffersAll(){

        if (!this._downloadExchangeOffersEnabled) return;

        for (let i=0; i <= 1; i++)
            await this.downloadExchangeOffers({type: i});

    }

    async downloadExchangeOffers({type, index}){

        const offersCount = await this._client.emitAsync("exchange/content-count", { offerType: type, }, 0);
        if (!offersCount) return;

        this.emit('consensus/exchange-offers-count', {type, count: offersCount});

        await this._downloadExchangeOffersSpecific({type, index});

    }

    async _downloadExchangeOffersSpecific({type, index, limit}){

        const offers = await this._client.emitAsync("exchange/content-ids", {offerType: type}, 0);
        if (!offers) return;

        this.emit('consensus/exchange-offers-ids', {type, offers: offers.out, next: offers.next, clear: index === undefined });

        for (const hash in offers.out)
            await this.getExchangeOffer(hash, type);

    }

    async getExchangeOffer(hash, type){

        if (this._data.offers[hash]) return this._data.offers[hash];

        const data = await this._client.emitAsync("exchange/get-offer", {offerHash: hash, offerType: type}, 0);
        if (!data) return;

        const offer = new ExchangeOffer( {
            ...PandoraPay._scope,
            chain: PandoraPay._scope.mainChain
        }, undefined, Buffer.from(data) );

        this._data.offers[hash] = offer;

        this.emit('consensus/exchange-offers', {type, offers: [offer] });

    }

    async startDownloadingExchangeOffers(){

        if (this._downloadExchangeOffersEnabled) return;

        this._downloadExchangeOffersEnabled = true;
        return this.downloadExchangeOffersAll();
    }

    async stopDownloadingExchangeOffers(){
        this._downloadExchangeOffersEnabled = false;
    }

    async startDownloadPendingTransactions(){

        if (this._downloadPendingTransactionsEnabled) return;

        this._downloadPendingTransactionsEnabled = true;
        return this.downloadPendingTransactions();
    }

    async stopDownloadPendingTransactions(){

        this._downloadPendingTransactionsEnabled = false;
    }

    async _stopped(){

    }


    async getBlockByHash(hash){

        if (this._data.blocks[hash]) return this._data.blocksByHash[hash];

        const blockData = await this._client.emitAsync("blockchain/get-block", { hash, type: "buffer"}, 0  );
        if (!blockData) return; //disconnected

        const block = new Block( {
            ...PandoraPay._scope,
            chain: PandoraPay._scope.mainChain
        }, undefined, Buffer.from(blockData) );


        await this._includeBlock(block);

        return block;


    }

    async getBlock(height){

        if (this._data.blocks[height]) return this._data.blocks[height];

        const blockData = await this._client.emitAsync("blockchain/get-block-by-height", {index: height, type: "buffer"}, 0  );
        if (!blockData) return; //disconnected

        const block = new Block({
            ...PandoraPay._scope,
            chain: PandoraPay._scope.mainChain
        }, undefined, Buffer.from(blockData));

        return this._includeBlock(block);

    }

    async _includeBlock(block){

        this.emit('consensus/block-downloaded', block );

        this._data.blocks[block.height] = block;
        this._data.blocksByHash[block.hash().toString("hex")] = block;

        const data = {};
        const txs = await block.getTransactions();
        for (const tx of txs) {

            console.log("_includeBlock", tx.hash().toString("hex"), block.height);

            tx.__extra = {
                height: block.height,
                timestamp: block.timestamp,
            };
            this._data.transactions[tx.hash().toString("hex")] = tx;
            data[tx.hash().toString("hex")] = tx;
        }
        this.emit('consensus/tx-downloaded', {transactions: data} );

        return block;
    }

    async getTransactionByHash(hash, isPending = false ){

        if (this._data.transactions[hash])
            if ( (isPending && !this._data.transactions[hash].__extra.height ) || (!isPending && this._data.transactions[hash].__extra.height ) )
                return this._data.transactions[hash];


        const txData = await this._client.emitAsync("transactions/get-transaction", { hash }, 0  );
        if (!txData) return; //disconnected

        const tx = PandoraPay._scope.mainChain.transactionsValidator.validateTx( txData.tx );

        tx.__extra = {
            height: txData.block,
            timestamp: txData.blockTimestamp,
            confirmations: txData.confirmations,
            memPoolQueued: txData.memPoolQueued,
            memPool: txData.memPool,
        };

        this._data.transactions[hash] = tx;

        const data = {};
        data[hash] = tx;

        this.emit('consensus/tx-downloaded', {transactions: data} );

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