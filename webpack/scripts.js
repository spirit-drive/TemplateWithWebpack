module.exports = () => ({
    test: /\.tsx?$/,
    use: [
        "babel-loader",
        "ts-loader"
    ],
    exclude: /node_modules/
});