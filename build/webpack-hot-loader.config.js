const path = require('path')
const webpack = require('webpack');
const base = require('./webpack-wallet.config');
const merge = require('webpack-merge');

module.exports = (env, argv) => merge( base(env, argv), {

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
        port: 8081,
        static: path.resolve(__dirname, "./../dist/dev"),
    },

    plugins: [
        new webpack.DefinePlugin({
            DEV_SERVER: 'true'
        }),
    ]

});

