const path = require('path'),
    webpack = require('webpack'),
    Html = require('html-webpack-plugin'),
    BrowserSyncPlugin = require('browser-sync-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    Clean = require('clean-webpack-plugin'),
    UglifyJs = require('uglifyjs-webpack-plugin'),
    Copy = require('copy-webpack-plugin'),
    Imagemin = require('imagemin-webpack-plugin').default,
    pug = require('./webpack/pug'),
    stylus = require('./webpack/stylus'),
    img = require('./webpack/img'),
    fonts = require('./webpack/fonts'),
    svg = require('./webpack/svg');

module.exports = {
    context: path.resolve(__dirname, 'app'),
    entry: './js/index.js',
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '../',
    },
    plugins: [
        new Html({
            template: 'index.pug'
        }),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            server: { baseDir: ['dist'] }
        }),
        new ExtractTextPlugin("./css/[name].css"),
        new Clean(['dist']),
        new Copy([{
            from: './img',
            to: 'img'
        }], {
            ignore: [{
                glob: 'svg/*'
            }]
        }),
        new Imagemin({
            test: /\.(png|gif|jpe?g|svg)$/i
        }),
        new UglifyJs({
            sourceMap: true
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ],
    module: {
        rules: [
            pug(),
            stylus(),
            img(),
            fonts(),
            svg()
        ]

    }
};