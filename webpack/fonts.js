module.exports = () => ({
    test: /\.(woff2?|oet|ttf|otf)$/,
    use: [{
        loader: 'file-loader',
        options: {
            name: '[path][name].[ext]'
        }
    }]
});