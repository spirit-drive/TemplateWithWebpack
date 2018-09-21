const
    path              = require('path'),
    Html              = require('html-webpack-plugin'),
    BrowserSyncPlugin = require('browser-sync-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    Clean             = require('clean-webpack-plugin'),
    UglifyJs          = require('uglifyjs-webpack-plugin'),
    Copy              = require('copy-webpack-plugin'),
    Imagemin          = require('imagemin-webpack-plugin').default,
    pug               = require('./webpack/pug'),
    stylus            = require('./webpack/stylus'),
    img               = require('./webpack/img'),
    fonts             = require('./webpack/fonts'),
    typescript        = require('./webpack/typescript'),
    svg               = require('./webpack/svg');

module.exports = (_, options) => {
    const isDevMode = options.mode === "development";

    return {
        context: path.resolve(__dirname, 'app'),
        entry: './tsx/index.tsx',
        output: {
            filename: 'js/[name].js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '../',
        },
        devtool: isDevMode && 'source-map',
        plugins: [
            new Html({
                template: 'index.pug'
            }),
            new BrowserSyncPlugin({
                host: 'localhost',
                port: 3000,
                server: { baseDir: ['dist'] }
            }),
            new ExtractTextPlugin("css/[name].css"),
            new Clean(['dist'], {verbose: true}),
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
                sourceMap: true,
                extractComments: true
            }),
        ],
        resolve: {
            extensions: [".ts", ".tsx", ".js"]
        },
        module: {
            rules: [
                pug(),
                stylus(isDevMode),
                img(),
                fonts(),
                svg(),
                typescript()
            ]
        },
    }
};