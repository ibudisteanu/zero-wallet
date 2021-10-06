const path = require('path');
const webpack = require('webpack');
const vueConfig = require('./vue-loader.config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin()

const isProd = process.env.NODE_ENV === 'production';
const isAnalyze = process.argv.includes('--analyzer');

const commonPlugins = [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
        VERSION: JSON.stringify(gitRevisionPlugin.version()),
        COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
        BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
        LASTCOMMITDATETIME: JSON.stringify(gitRevisionPlugin.lastcommitdatetime()),
    }),
    new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
    })
]

module.exports = webpackConfig = {

    //define entry point
    devtool: isProd ? false : 'eval-cheap-module-source-map',

    // send to distribution
    output: {
        path: path.resolve(__dirname, './../dist'),
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
        }
    },
    module: {

        rules: [
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/[contenthash].[ext]',
                            publicPath: '/',
                        },
                    },
                ],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueConfig
            },
            {
                test: /\.css$/,
                use: isProd
                    ? ExtractTextPlugin.extract({
                        use: 'css-loader?minimize',
                        fallback: 'vue-style-loader'
                    })
                    : ['vue-style-loader', 'css-loader']
            }
        ]
    },
    plugins: isProd
        ? [
            ...(isAnalyze ? [new BundleAnalyzerPlugin()] : []),

            new webpack.optimize.UglifyJsPlugin({
                compress: { warnings: false }
            }),

            new ExtractTextPlugin({
                filename: 'common.[chunkhash].css'
            }),
            ...commonPlugins,
        ]
        : [
            ...(isAnalyze ? [new BundleAnalyzerPlugin()] : []),
            new FriendlyErrorsPlugin(),
            ...commonPlugins,
        ]
};
