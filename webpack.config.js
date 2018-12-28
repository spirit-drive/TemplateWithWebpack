const
  path = require('path'),
  Html = require('html-webpack-plugin'),
  ExtractTextPlugin = require("extract-text-webpack-plugin"),
  Imagemin = require('imagemin-webpack-plugin').default,
  Clean = require("clean-webpack-plugin");

module.exports = (env, options) => {
  const isDevMode = options.mode === "development";
  const dist = path.join(__dirname, 'dist');
  const src = path.join(__dirname, 'src');

  return {
    context: src,
    entry: './index.js',
    output: {
      path: dist,
      filename: 'js/[name].js',
    },
    devtool: isDevMode && 'source-map',
    devServer: {
      overlay: true,
      host: '0.0.0.0',
      stats: {
        assets: true,
        children: false,
        chunks: false,
        hash: false,
        modules: false,
        publicPath: false,
        timings: true,
        version: false,
        warnings: true,
        optimizationBailout: true,
        colors: {
          green: '\u001b[32m',
        }
      }
    },
    resolve: {
      modules: [src, 'node_modules'],
    },
    plugins: [
      new Html({
        template: 'index.html'
      }),
      new ExtractTextPlugin("css/[name].css"),
      new Clean([dist]),
      new Imagemin({
        test: /\.(png|gif|jpe?g|svg)$/i
      }),
    ],
    module: {
      rules: [
        {
          test: /\.styl$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [{
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[path][local]-[hash:base64:5]',
              }
            }, {
              loader: 'postcss-loader',
            }, {
              loader: 'stylus-loader',
              options: {
                sourceMap: isDevMode
              }
            }]
          })
        },
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
          }
        },
        {
          test: /\.(png|gif|jpe?g)$/i,
          loaders: [{
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          }, 'img-loader']
        },
        {
          test: /\.(woff2?|oet|([to]tf))$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          }]
        }
      ]
    },
  }
};
