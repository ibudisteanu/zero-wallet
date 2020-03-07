const path = require('path')
const webpack = require('webpack');
const base = require('./webpack.browser.config');
const merge = require('webpack-merge');

const config = merge(base, {

    devtool: 'cheap-module-eval-source-map',

    entry: [
        'webpack-hot-middleware/client',
        './src/main.js'
    ],

    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
        filename: "Wallet-User-Interface-bundle.js"
    },

    devServer: {
        compress: true,
        historyApiFallback: true,
        hot: true,
        open: true,
        overlay: true,
        port: 8080,
        stats: {
            normal: true
        },
    },

    plugins: [

        new webpack.DefinePlugin({
            "process.env": {
                DEV_SERVER: 'true'
            }
        }),


    ]

});

module.exports = config;