const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const htmlPlugin = new HtmlWebPackPlugin({
	template: path.join(__dirname, './index.html'),
	filename: "index.html",
});
module.exports = {
  mode: 'development',
  module: {
    rules: [{
      test: /\.(png|jpg|gif)$/,
      use: {
        loader: 'file-loader'
      }
    }],
  },
  devtool: 'source-map',
  plugins: [
    htmlPlugin,
    new webpack.HotModuleReplacementPlugin()
  ]
}