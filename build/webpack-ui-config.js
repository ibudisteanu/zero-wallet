const base = require('./webpack-ui-base-config')
const { merge } = require('webpack-merge')
const { SubresourceIntegrityPlugin } = require("webpack-subresource-integrity");

module.exports = (env, argv) => merge( base (env, argv), {
    output: {
        // the following setting is required for SRI to work:
        crossOriginLoading: "anonymous",
    },
    plugins: [
        new SubresourceIntegrityPlugin(),
    ],
});
