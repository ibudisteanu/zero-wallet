const webpack = require('webpack')
const base = require('./webpack.base.config')
const merge = require('webpack-merge')
const path = require('path')

module.exports = (env, argv) => merge( base(env, argv), {
    target: 'web',
    mode: 'production',

    //define entry point
    entry: {
        app: "./src/main.js",
    },
    output: {
        path: path.resolve(__dirname, "./../dist/build"),
        filename: "Wallet-User-Interface.js"
    },

});
