module.exports = () => ({
    test: /\.tsx?$/,
    use: [{
        loader: "babel-loader"
    },{
        loader: "ts-loader",
    }],
    exclude: /node_modules/
});