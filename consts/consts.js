export default {

    name: "PandoraPay",
    title: 'PandoraPay',
    entity: 'PandoraPay',
    version: '0.125',

    goArgv: [
        'js',
        '--devnet',
        '--new-devnet',
        '--store-wallet-type=memory',
        '--consensus=wallet',
        '--tcp-max-clients=1'
    ],

}
