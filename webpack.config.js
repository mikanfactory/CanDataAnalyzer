var webpack = require('webpack')
var path = require('path')

module.exports = {
  target: 'web',
  entry: [path.join(__dirname, 'client/index.jsx')],
  output: {
    path: path.join(__dirname, 'public/js'),
    publicPath: '/js/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' },
      { test: /\.csv$/, loader: 'dsv-loader' },
      { test: /\.toml$/, loader: 'toml-loader' },
      {
        test: /\.js(x?)$/,
        cacheDirectory: true,
        exclude: [/node_modules/],
        loader: 'babel-loader?presets[]=es2015-node5&presets[]=react'
      }
    ]
  },
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
  ],
  cache: true
}
