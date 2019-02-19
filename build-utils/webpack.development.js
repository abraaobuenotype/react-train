const webpack = require('webpack')
const path = require('path')

module.exports = () => ({
    devtool: 'source-map',

    devServer: {
        index: 'index.html',
        contentBase: path.join(__dirname, '../dist'),
        compress: true,
        hot: true,
        port: 9005,
        writeToDisk: true,
        open: true,
        historyApiFallback: true
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
})
