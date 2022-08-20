const base = require('./webpack-base-config')
const { merge } = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const consts = require('../consts/consts')
const {SubresourceIntegrityPlugin} = require("webpack-subresource-integrity");
const HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");
module.exports = (env, argv) => {

    const isProd = argv.mode === "production"

    return merge( base(env, argv), {

        entry: [
            "./src/main.js",
        ],

        output: {
            filename: "Wallet-User-Interface.js"
        },

        plugins: [
            new HtmlWebpackPlugin({
                hash: true,
                title: consts.title,
                description: consts.name,
                template:  path.resolve(__dirname + '/../src/index.hbs'),
                filename: path.resolve(__dirname + `/../dist/${isProd ? 'build' : 'dev'}/index.html`) //relative to root of the application
            }),
            new SubresourceIntegrityPlugin({enabled: isProd }),
            new HtmlWebpackTagsPlugin({ tags: ['static/theme.css', 'static/OverlayScrollbars.min.css', 'static/fonts.css'], append: true })
        ],
    });
}
