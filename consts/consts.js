module.exports = {

    name: "PandoraPay",
    title: 'PandoraPay',
    entity: 'PandoraPay',
    website: 'https://pandorapay.org/',

    assetsInfoPagination: 10,
    blocksInfoPagination: 10,
    addressTxsPagination: 10,
    mempoolTxsPagination: 50,

    goArgv: [
        'js',
        '--network=devnet',
        '--new-devnet',
        '--consensus=wallet',
        '--tcp-max-clients=1'
    ],

}
