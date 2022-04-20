const base = require('./webpack.base.config')
const merge = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {

    const isProd = argv.mode === "production"

    return merge( base(env, argv), {

        entry: {
            app: "./src/main.js",
        },

        output: {
            filename: "Wallet-User-Interface.js"
        },

        plugins: [
            new HtmlWebpackPlugin({
                hash: true,
                title: "PandoraPay",
                description: "PandoraPay",
                template:  path.resolve(__dirname + '/../src/index.hbs'),
                filename: path.resolve(__dirname + `/../dist/${isProd ? 'build' : 'dev'}/index.html`) //relative to root of the application
            }),
        ],
    });
}
