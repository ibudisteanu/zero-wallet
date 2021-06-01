const path = require('path')
const webpack = require('webpack');
const base = require('./../webpack.browser.config');
const merge = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');

const config = merge(base, {

    output: {
        path: path.resolve(__dirname, "../../../PandoraPay-website/public/wallet-dist"),
        publicPath: "/",
        filename: 'Wallet-User-Interface-bundle.js'
    },

    plugins: [
        new CopyPlugin([
            { from: './dist/assets', to: '../../../PandoraPay-website/public/wallet-dist/assets' }
        ])
    ]
});

module.exports = config;
