const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (isDevMode) => ({
    test: /\.styl$/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
            loader: 'css-loader',
            options: {sourceMap: isDevMode}
        }, {
            loader: 'postcss-loader',
            options: {sourceMap: isDevMode}
        }, {
            loader: 'stylus-loader',
            options: {sourceMap: isDevMode}
        }]
    })
});