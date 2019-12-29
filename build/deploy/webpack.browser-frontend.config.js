const webpack = require('webpack');
const base = require('./../webpack.browser.config');
const merge = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');

const config = merge(base, {

    output: {
        filename: '../../Website/public/Zero-dist/Wallet-User-Interface-bundle.js'
    },

    plugins: [
        new CopyPlugin([
            { from: './dist/assets', to: '../../Website/public/Zero-dist/assets' }
        ])
    ]
});

module.exports = config;
