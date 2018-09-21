module.exports = () => ({
    test: /\.tsx?$/,
    use: ["babel-loader", "ts-loader", "tslint-loader"]
});