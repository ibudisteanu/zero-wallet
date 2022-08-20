const base = require('./webpack.base.config')
const { merge } = require('webpack-merge')
const path = require('path')

module.exports = (env, argv) => {

    const isProd = argv.mode === "production"

    return merge( base(env, argv), {

        //define entry point
        entry: {
            app: "./src/webworkers/pandorapay-webworker/pandorapay-webworker.js",
        },

        output: {
            path: path.resolve(__dirname, `./../dist/${isProd ? 'build': 'dev'}/workers`),
            filename: "PandoraPay-webworker.js"
        },

    });
}
