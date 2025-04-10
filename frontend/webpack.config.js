const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isDev = process.argv.includes('--mode=development')

const compileNodeModules = [
	// Add every react-native package that needs compiling
	// 'react-native-gesture-handler',
	// 'react-native-paper',
	// 'react-native-vector-icons',
].map(moduleName => path.resolve(__dirname, `node_modules/${moduleName}`));

const babelLoaderConfig = {
	test: /\.(js|jsx|ts|tsx)$/,
	// Add every directory that needs to be compiled by Babel during the build.
	// include: [
	// // 	path.resolve(__dirname, 'src'),
	// // 	path.resolve(__dirname, 'src/index.js'),
	// ...compileNodeModules,
	// ],
	// exclude: /node_modules/,
	loader: 'babel-loader',
}

const fontLoaderConfig = {
	test: /\.(ttf|eot|woff|woff2)$/i,
	loader: 'file-loader',
	include: [
		path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
		path.resolve(__dirname, 'src/fonts'),
	],
	options: {
		name: 'src/fonts/[name].[hash].[ext]',  // Output path for font files
	},
}

const plugins = [
	new HtmlWebpackPlugin({
		template: path.join(__dirname, 'index.html')
	}),
	new webpack.DefinePlugin({
		'__DEV__': isDev,
	}),
	new webpack.ProvidePlugin({
		process: 'process/browser',
	}),
	// new CopyPlugin({
	// 	patterns: [
	// 		{ from: path.resolve(__dirname, 'src/assets'), to: 'assets' },
	// 	],
	// }),
	...(isDev ? [new BundleAnalyzerPlugin()] : [])
]

module.exports = {
	target: 'web',
	mode: 'development',
	entry: {
		app: path.join(__dirname, 'src/index.js'),
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			babelLoaderConfig,
			fontLoaderConfig,
		],
	},
	plugins,
	resolve: {
		alias: {
			'react-native$': 'react-native-web',
			'react-native-safe-area-context': 'expo-dev-menu/vendored/react-native-safe-area-context/src',
		},
		extensions: [
			'.mjs',
			'.web.tsx',
			'.tsx',
			'.web.ts',
			'.ts',
			'.web.jsx',
			'.jsx',
			'.web.js',
			'.js',
			'.css',
			'.json'
		],
	},
	devtool: isDev ? 'eval' : 'source-map',
	devServer: {
		compress: true,
		port: 3000,
		static: {
		  directory: path.resolve(__dirname, 'dist'),
		},
		historyApiFallback: true,
		proxy: [
		  {
			context: ['/api'],
			target: 'http://localhost:4000',
			secure: false,
			changeOrigin: true,
		  },
		],
	  },
};