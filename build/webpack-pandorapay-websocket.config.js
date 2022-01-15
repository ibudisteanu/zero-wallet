const webpack = require('webpack')
const base = require('./webpack.base.config')
const merge = require('webpack-merge')
const path = require('path')

module.exports = merge(base, {
    target: 'web',
    mode: 'production',

    //define entry point
    entry: {
        app: "./src/webworkers/pandorapay-webworker/pandorapay-webworker.js",
    },

    output: {
        path: path.resolve(__dirname, "./../dist/dev/workers"),
        filename: "PandoraPay-webworker.js"
    },

});
