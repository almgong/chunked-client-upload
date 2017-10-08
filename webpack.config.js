let path = require('path');
let webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: './dist/index-bundle.js'
  },
  module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['babel-preset-es2015']
        }
      }
    }
  ]
}
};