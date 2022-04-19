const base = require('./webpack.base.config')
const merge = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const consts = require("../consts/consts")

module.exports = (env, argv) => {

    const isProd = argv.mode === "production"

    return merge( base(env, argv), {

        output: {
            filename: "Wallet-User-Interface.js"
        },
        plugins: [
            new HtmlWebpackPlugin({
                hash: true,
                title: consts.webpage.title,
                template:  path.resolve(__dirname + '/../src/index.hbs'),
                filename: path.resolve(__dirname + `/../dist/${isProd ? 'build' : 'dev'}/index.html`) //relative to root of the application
            }),
        ],
    });
}
