const base = require('./webpack-wallet-base.config')
const merge = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const consts = require("../consts/consts")

module.exports = (env, argv) => merge( base (env, argv), {
    target: 'web',

    //define entry point
    entry: {
        app: "./src/main.js",
    },
    output: {
        path: path.resolve(__dirname, "./../dist/build"),
        filename: "Wallet-User-Interface.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            title: consts.webpage.title,
            template:  path.resolve(__dirname + '/../src/index.hbs'),
            filename: path.resolve(__dirname + '/../dist/build/index.html') //relative to root of the application
        }),
    ],
});
