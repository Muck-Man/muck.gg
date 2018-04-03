const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const path = require('path');

const DIR = {
	APP: path.resolve(__dirname, './src/client'),
	BUILD: path.resolve(__dirname, './src/public/build')
};

console.log(process.env.NODE_ENV);

module.exports = {
	entry: [
		path.join(DIR.APP, 'js', 'app.js'),
		path.join(DIR.APP, 'scss', 'app.scss')
	],
	output: {
		filename: '[hash].js',
		path: DIR.BUILD
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				include: [/node_modules/, path.join(DIR.APP, 'scss', 'app.scss')],
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader', 'sass-loader'
				]
			}
		]
	},
	mode: (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()) || 'development',
	plugins: [
		new CleanWebpackPlugin(['./*.*'], {root: DIR.BUILD}),
		new MiniCssExtractPlugin({filename: '[hash].css'}),
		new ManifestPlugin({filename: 'manifest.json'})
	]
};