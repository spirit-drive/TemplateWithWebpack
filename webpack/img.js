module.exports = () => ({
    test: /\.(png|gif|jpe?g)$/i,
    loaders: [{
        loader: 'file-loader',
        options: {
            name: '[path][name].[ext]'
        }
    }, 'img-loader']
});