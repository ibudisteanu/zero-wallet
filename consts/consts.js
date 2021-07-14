export default {

    name: "PandoraPay",
    title: 'PandoraPay',
    entity: 'PandoraPay',
    version: '0.125',

    blocksInfoPagination: 10,
    addressTxsPagination: 5,
    mempoolTxsPagination: 50,

    goArgv: [
        'js',
        '--network=devnet',
        '--new-devnet',
        '--store-wallet-type=memory',
        '--consensus=wallet',
        '--tcp-max-clients=1'
    ],

}
