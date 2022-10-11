const path = require('path')
const base = require('./webpack-ui-base-config');
const { merge } = require('webpack-merge');

module.exports = (env, argv) => merge( base(env, argv), {

    entry: [
        'webpack-hot-middleware/client',
    ],

    devServer: {
        historyApiFallback: true,
        hot: true,
        open: true,
        port: 8081,
        static: path.resolve(__dirname, "./../dist/dev"),
    },

    plugins: [

    ]

});

