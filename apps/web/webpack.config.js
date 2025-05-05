// apps/web/webpack.config.js

import path from 'path'
import { fileURLToPath } from 'url'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import Dotenv from 'dotenv-webpack'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
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

	const returnValue = matchesSources || matchesNodeModule
	if (!returnValue && filepath.includes('node_modules')) {
		console.log(`Skipping: ${filepath}`)
	}
	return returnValue
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
	}),
	new webpack.ProvidePlugin({
		process: 'process/browser',
	}),
	new Dotenv({
		path: path.resolve(__dirname, '.env'),
		systemvars: true,
	}),
	...(process.env.ANALYZE === 'true' ? [new BundleAnalyzerPlugin()] : []),
]

export default {
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
			// 'process': 'process/browser.js',
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
		proxy: [
			{
				context: ['/api'],
				target: `http://localhost:${process.env.API_PORT || 4000}`,
				secure: false,
				changeOrigin: true,
			},
		],
	},
}