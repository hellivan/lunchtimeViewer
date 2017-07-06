const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './client/src/main.ts',

	output: { path: __dirname + '/client/dist', filename: 'bundle.js' },
	
	resolve: {
		extensions: ['.ts', '.js']
	},

	resolveLoader: {
        moduleExtensions: ['-loader']
    },

	module: {
		loaders: [
			{
				test: /\.ts$/,
				loaders: ['ts', 'angular2-template-loader']
			},
			{
				test: /\.html$/,
				loader: 'html'
			},
			{
				test: /\.css$/,
				loaders: ['style', 'css']
			},
			{
				test: /\.scss$/,
				loaders: ['style', 'css', 'sass']
			},
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "url?limit=10000&minetype=application/font-woff&name=assets/[name].[ext]"
			},
			{
				test: /\.(png|jpe?g|gif|svg|ttf|eot|ico)(\?.*$|$)/,
				loader: 'file?name=assets/[name].[ext]'
			}
		]
	},
	plugins: [
        new CopyWebpackPlugin([
            {
                from: 'client/src/index.html',
                to: '.',
                flatten: true
            }
        ])
    ]	
};
