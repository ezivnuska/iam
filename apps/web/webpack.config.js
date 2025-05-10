// apps/web/webpack.config.js (CommonJS version)

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const Dotenv = require('dotenv-webpack')

const isDev = process.env.NODE_ENV !== 'production'

const includedModules = (filepath) => {
	const sourcesToCompile = [
		path.resolve(__dirname, './src'),
		path.resolve(__dirname, './src/assets/fonts'),
		path.resolve(__dirname, '../../packages/auth/src'),
		path.resolve(__dirname, '../../packages/services/src'),
		path.resolve(__dirname, '../../packages/types/src'),
	]

	const nodeModulePackages = [
		'react-native',
		'react-native-web',
		'react-native-screens',
		'react-native-safe-area-context',
		'react-native-gesture-handler',
		'react-native-reanimated',
		'react-native-pager-view',
		'react-native-vector-icons',
		'@expo',
		'expo',
	]

	const matchesSources = sourcesToCompile.some(src => filepath.startsWith(src))

	const matchesNodeModule = nodeModulePackages.some(pkg =>
		filepath.includes(`node_modules/${pkg}`)
	)

	return matchesSources || matchesNodeModule
}

const babelLoaderConfig = {
	test: /\.[jt]sx?$/,
	resolve: {
		fullySpecified: false,
	},
	include: includedModules,
	use: {
		loader: 'babel-loader',
		options: {
			babelrc: true,
		},
	},
}

const imageLoaderConfig = {
	test: /\.(png|jpe?g|gif|svg)$/i,
	type: 'asset/resource',
}

const fontLoaderConfig = {
	test: /\.(ttf|eot|woff|woff2)$/i,
	type: 'asset/resource',
	include: includedModules,
	generator: {
		filename: 'assets/fonts/[name].[hash][ext]',
	},
}

const plugins = [
	new HtmlWebpackPlugin({
		template: path.join(__dirname, 'index.html'),
	}),
	new webpack.DefinePlugin({
		__DEV__: JSON.stringify(isDev),
        'process.env.API_PATH': JSON.stringify(process.env.API_PATH),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
	}),
	new webpack.ProvidePlugin({
		process: 'process/browser',
	}),
	new Dotenv({
		path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
        systemvars: true,
	}),
	...(process.env.ANALYZE === 'true' ? [new BundleAnalyzerPlugin()] : []),
]

module.exports = {
	target: 'web',
	mode: isDev ? 'development' : 'production',
	entry: {
		app: path.join(__dirname, 'src/index.ts'),
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.[jt]sx?$/,
				resolve: {
					fullySpecified: false,
				},
			},
			babelLoaderConfig,
			fontLoaderConfig,
			imageLoaderConfig,
		],
	},
	plugins,
	resolve: {
		alias: {
			'react-native$': 'react-native-web',
			'react-native-vector-icons': '@expo/vector-icons',
			'@auth': path.resolve(__dirname, '../../packages/auth/src'),
			'@services': path.resolve(__dirname, '../../packages/services/src'),
			'@iam/types': path.resolve(__dirname, '../../packages/types/src'),
			'@': path.resolve(__dirname, 'src'),
		},
		extensions: [
			'.web.tsx',
			'.tsx',
			'.web.ts',
			'.ts',
			'.web.jsx',
			'.jsx',
			'.web.js',
			'.js',
			'.css',
			'.json',
			'.ttf',
			'.fx',
		],
		fullySpecified: false,
	},
	devtool: isDev ? 'eval' : 'source-map',
	devServer: {
		compress: true,
		port: process.env.PORT || 3000,
		static: {
			directory: path.resolve(__dirname, 'dist'),
		},
		historyApiFallback: true,
		proxy: process.env.NODE_ENV === 'development' ? [
			{
				context: ['/api', '/images'],
				target: `http://localhost:${process.env.API_PORT || 4000}`,
				secure: false,
				changeOrigin: true,
			},
		] : undefined,
	},
}