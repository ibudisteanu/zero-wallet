const webpack = require('webpack')
const base = require('./webpack.base.config')
const merge = require('webpack-merge')

const config = merge(base, {
    target: 'web',

    node: {
        child_process: "empty",
        dgram: "empty",
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        uws: 'empty'
    },

    //define entry point
    entry: {
        app: "./src/main.js",
    },
    output: {
        filename: 'Wallet-User-Interface-bundle.js',
    },

    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                BROWSER: 'true'
            }
        })
    ]

});

module.exports = config