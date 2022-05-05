const base = require('./webpack-wallet-base.config')
const { merge } = require('webpack-merge')
const path = require('path')

module.exports = (env, argv) => merge( base (env, argv), {
    plugins: [

    ],
});
