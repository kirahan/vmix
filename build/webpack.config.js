var path = require("path");
var webpack = require('webpack')
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
module.exports = {
    entry: './webentry.js', 
    output: {
        path:  __dirname+'/../dist/',
        filename: 'vmix.js',
		publicPath: "./",		
		libraryTarget: "umd"
    },

	plugins: [
        new UglifyJsPlugin({   
				output: {comments: false },
				compress: {warnings: false  },
				sourceMap: true
		}),
	 ],
  module: {
    loaders: [ ]
  }
};