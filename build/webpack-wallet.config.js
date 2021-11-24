const webpack = require('webpack')
const base = require('./webpack.base.config')
const merge = require('webpack-merge')
const path = require('path')

module.exports = merge(base, {
    target: 'web',
    mode: 'production',

    //define entry point
    entry: {
        app: "./src/main.js",
    },
    output: {
        path: path.resolve(__dirname, "./../dist/dev"),
        filename: "Wallet-User-Interface.js"
    },

    plugins: [

        new webpack.DefinePlugin({
            "BROWSER": 'true',
        }),

    ]

});
