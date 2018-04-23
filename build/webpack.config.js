var path = require("path");
var webpack = require('webpack')
//var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const UglifyJsPluginES6 = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: './webentry.js', 
    output: {
        path:  __dirname+'/../dist/',
        filename: 'vmix.js',
		publicPath: "./",		
		libraryTarget: "umd"
    },

	plugins: [
       /* new UglifyJsPlugin({   
				output: {comments: false },
				compress: {warnings: false  },
				sourceMap: true
		}),*/

        new UglifyJsPluginES6({   
			uglifyOptions:{			
			  ecma: 6,
			  warnings: false,
			  compress: true,
			  mangle:false,
		}})

	 ],
  module: {
    loaders: [ ]
  }
};