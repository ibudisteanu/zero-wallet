const path = require('path')
const webpack = require('webpack');
const base = require('./webpack-wallet-base.config');
const merge = require('webpack-merge');

module.exports = (env, argv) => merge( base(env, argv), {


    entry: [
        'webpack-hot-middleware/client',
        './src/main.js'
    ],

    output: {
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

