module.exports = () => ({
    test: /\.(woff2?|oet|([to]tf))$/,
    use: [{
        loader: 'file-loader',
        options: {
            name: '[path][name].[ext]'
        }
    }]
});