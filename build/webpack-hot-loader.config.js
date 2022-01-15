const path = require('path')
const webpack = require('webpack');
const base = require('./webpack-wallet.config');
const merge = require('webpack-merge');

module.exports = merge(base, {

    devtool: 'eval-cheap-module-source-map',
    mode: 'development',

    entry: [
        'webpack-hot-middleware/client',
        './src/main.js'
    ],

    output: {
        path: path.resolve(__dirname, "./../dist/dev"),
        filename: "Wallet-User-Interface-dev.js"
    },

    devServer: {
        historyApiFallback: true,
        hot: true,
        open: true,
        overlay: true,
        port: 8081,
        stats: {
            normal: true
        },
    },

    plugins: [
        new webpack.DefinePlugin({
            DEV_SERVER: 'true'
        }),
    ]

});

