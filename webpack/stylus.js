const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = () => ({
    test: /\.styl$/,
    use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: [{
            loader: 'css-loader',
            options: {sourceMap: true}
        }, {
            loader: 'postcss-loader',
            options: {sourceMap: true}
        }, {
            loader: 'stylus-loader',
            options: {sourceMap: true}
        }]
    })
});