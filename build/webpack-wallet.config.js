const webpack = require('webpack')
const base = require('./webpack.base.config')
const merge = require('webpack-merge')
const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = merge(base, {
    target: 'web',
    mode: 'production',

    //define entry point
    entry: {
        app: "./src/main.js",
    },
    output: {
        path: path.resolve(__dirname, "./../dist/build"),
        publicPath: "/",
        filename: "Wallet-User-Interface.js"
    },

    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                BROWSER: 'true'
            },
        }),
        new CompressionWebpackPlugin({
            filename: '[path][base].gz',
            algorithm: 'gzip',
            test: new RegExp('\\.(js|css)$'),
            threshold:10240,
            minRatio: 0.8,
        })
    ]

});
