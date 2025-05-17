// apps/web/webpack.config.js (CommonJS version)

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const Dotenv = require('dotenv-webpack')
const fs = require('fs')

const env = process.env.NODE_ENV || 'production'

// Paths to .env files
const sharedEnvPath = path.resolve(__dirname, '../../.env.' + env)
const localEnvPath = path.resolve(__dirname, `.env.${env}`)

// Function to conditionally load Dotenv plugin
const dotenvPlugins = []

if (fs.existsSync(sharedEnvPath)) {
    dotenvPlugins.push(
        new Dotenv({
            path: sharedEnvPath,
            systemvars: true,
        })
    )
}
  
if (fs.existsSync(localEnvPath)) {
    dotenvPlugins.push(
        new Dotenv({
            path: localEnvPath,
            systemvars: true,
        })
    )
}

const includedModules = (filepath) => {
	const sourcesToCompile = [
		path.resolve(__dirname, './src'),
		path.resolve(__dirname, './src/assets/fonts'),
		path.resolve(__dirname, '../../packages/auth/src'),
		path.resolve(__dirname, '../../packages/services/src'),
		path.resolve(__dirname, '../../packages/types/src'),
		// path.resolve(__dirname, '../../packages/types/build'),
		path.resolve(__dirname, '../../packages/utils/src'),
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
		__DEV__: process.env.NODE_ENV !== 'production',
	}),
	new webpack.ProvidePlugin({
		process: 'process/browser',
	}),
	...dotenvPlugins,
	...(process.env.ANALYZE === 'true' ? [new BundleAnalyzerPlugin()] : []),
]

module.exports = {
	target: 'web',
	mode: env,
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
			'@utils': path.resolve(__dirname, '../../packages/utils/src'),
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
	devtool: env !== 'production' ? 'eval' : 'source-map',
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