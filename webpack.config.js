const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpackMerge = require('webpack-merge')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const {
    CheckerPlugin
} = require('awesome-typescript-loader')

const modeConfig = env => require(`./build-utils/webpack.${env}`)(env)
const presetConfig = require('./build-utils/loadPresets')

module.exports = ({
        mode,
        presets
    } = {
        mode: 'production',
        pressets: []
    }) =>
    webpackMerge({
            mode,
            entry: [path.resolve(__dirname, 'src/Main.ts')],
            output: {
                path: path.resolve(__dirname, 'dist/'),
                filename: 'react-train.js',
                library: 'train',
                libraryTarget: 'umd',
                umdNamedDefine: true
            },

            module: {
                rules: [{
                        test: /\.tsx?$/,
                        loader: 'awesome-typescript-loader'
                    },
                    {
                        enforce: 'pre',
                        test: /\.js$/,
                        loader: 'source-map-loader'
                    }
                ]
            },

            resolve: {
                extensions: ['.tsx', '.ts', '.js', '.json'],
                plugins: [new TsconfigPathsPlugin()]
            },

            plugins: [
                new CleanWebpackPlugin(['dist/*'], {
                    verbose: true
                }),
                new HtmlWebpackPlugin({
                    title: 'teste',
                    filename: 'index.html',
                    minify: {
                        collapseWhitespace: true
                    },
                    template: 'index.html',
                    alwaysWriteToDisk: true,
                    inject: 'head'
                }),

                new CheckerPlugin()
            ],

            externals: {
                'react': 'react',
                'react-dom': 'react-dom',
                'styled-components': 'styled-components'
            }
        },
        modeConfig(mode),
        presetConfig({
            mode,
            presets
        })
    )