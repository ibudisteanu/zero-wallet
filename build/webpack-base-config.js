const path = require('path');
const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { VueLoaderPlugin } = require('vue-loader')
const TerserPlugin = require('terser-webpack-plugin');
const CompressionWebpackPlugin = require("compression-webpack-plugin");

const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin()

module.exports = (env, argv) => {

    const isProd = argv.mode === "production"
    const isAnalyze = process.argv.includes('--analyzer');
    const isDevServer = process.env.WEBPACK_DEV_SERVER

    console.log("isProd", isProd)

    return {
        target: 'web',

        mode: isProd ? 'production' : 'development',
        //define entry point
        devtool: isProd ? false : 'eval-cheap-module-source-map',

        // send to distribution
        output: {
            path: path.resolve(__dirname, `./../dist/${isProd ? 'build' : 'dev'}`),
            publicPath: '/',
            filename: '[name].[chunkhash].js'
        },
        resolve: {
            extensions: [ '.js', '.vue' ],
            alias: {
                src: path.resolve(__dirname + '/../src'),
                consts: path.resolve(__dirname + '/../consts'),
            },
            fallback: {
                fs: false,
                assert: false,
                crypto: false,
                stream: false,
                util: false,
                http: false,
                https: false,
                net: false,
                path: false,
                tls: false,
                zlib: false,
                buffer: false,
                child_process: false,
                dgram: false,
                uws: false,
                os: false,
            }
        },
        module: {
            rules: [{
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [ {
                    loader: 'file-loader',
                    options: {
                        name: 'assets/[contenthash].[ext]',
                        publicPath: '/',
                    },
                }],
            }, {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    extractCSS: isProd,
                    preserveWhitespace: false,
                }
            }, {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            }
            ]
        },
        optimization: isProd ? {
            minimize: true,
            minimizer: [new TerserPlugin()],
        } : undefined,

        plugins: [
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
            }),

            new VueLoaderPlugin(),
            new webpack.DefinePlugin({
                VERSION: JSON.stringify(gitRevisionPlugin.version()),
                COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
                BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
                LASTCOMMITDATETIME: JSON.stringify(gitRevisionPlugin.lastcommitdatetime()),
                BROWSER: true,
                FILES_VERSIONING: Math.random().toString(),
                __VUE_OPTIONS_API__: true,
                __VUE_PROD_DEVTOOLS__: false,
            }),
            ...(isAnalyze ? [new BundleAnalyzerPlugin()] : []),
            ... ( isProd ? [
                        new TerserPlugin(),
                        new CompressionWebpackPlugin({
                            filename: '[path][base].gz',
                            algorithm: 'gzip',
                            test: new RegExp('\\.(js|css)$'),
                            threshold:10240,
                            minRatio: 0.8,
                        }),
                    ]
                    : [
                        new FriendlyErrorsWebpackPlugin(),
                        new webpack.DefinePlugin({
                            DEV_SERVER: true
                        }),
                    ]),
        ]
    }

};
