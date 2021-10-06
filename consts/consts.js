export default {

    name: "PandoraPay",
    title: 'PandoraPay',
    entity: 'PandoraPay',

    blocksInfoPagination: 10,
    addressTxsPagination: 5,
    mempoolTxsPagination: 50,

    goArgv: [
        'js',
        '--network=devnet',
        '--new-devnet',
        '--consensus=wallet',
        '--tcp-max-clients=1'
    ],

}
