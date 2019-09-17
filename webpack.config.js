var webpack = require('webpack');
var path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

var BUILD_DIR = path.resolve(__dirname, 'public');
var APP_DIR = path.resolve(__dirname, 'client');

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./index.html",
  filename: "./index.html",
  favicon: 'favicon.ico'
});

var config = {

  entry: {
    bundle: ['@babel/preset-env', APP_DIR + '/index.js']
  },
  output: {
    path: BUILD_DIR,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module : {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },{
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}  
          }
        ]
      },{
        test: /\.(css|scss)(\?.+)?$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader",
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[name]_[local]_[hash:base64]",
              include: /flexboxgrid/,
              sourceMap: true,
              minimize: true
            }
          }
        ]
      },{
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]',
              outputPath: BUILD_DIR + '/fonts/'
            }
          }
        ]
      }
      
    ]
  },
  plugins: [htmlPlugin],
  node: {
    fs: 'empty'
  }
};

module.exports = config;