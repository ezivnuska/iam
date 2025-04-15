import path from 'path'
import { fileURLToPath } from 'url'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import Dotenv from 'dotenv-webpack'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isDev = process.env.NODE_ENV !== 'production'

const compileNodeModules = [
	// Add every react-native package that needs compiling
	// 'react-native-gesture-handler',
	// 'react-native-paper',
	// 'react-native-vector-icons',
].map(moduleName => path.resolve(__dirname, `node_modules/${moduleName}`));

const babelLoaderConfig = {
	test: /\.[jt]sx?$/,
	// Add every directory that needs to be compiled by Babel during the build.
	include: (filepath) => {
		return (
			filepath.startsWith(path.resolve(__dirname, 'src')) ||
			filepath.startsWith(path.resolve(__dirname, '../../packages/ui/src')) ||
			filepath.startsWith(path.resolve(__dirname, '../../packages/types/src')) ||
			filepath.startsWith(path.resolve(__dirname, '../../packages/auth/src')) ||
			filepath.startsWith(path.resolve(__dirname, '../../packages/validation/src')) ||
			filepath.includes(`node_modules/expo/`) ||
			filepath.includes(`node_modules/expo-modules-core/`)
		)
	},
	use: {
		loader: 'babel-loader',
		options: {
			presets: [
				"babel-preset-expo",
				"@babel/preset-typescript",
			],
		},
	},
}

const fontLoaderConfig = {
	test: /\.(ttf|eot|woff|woff2)$/i,
	include: [
		path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
		path.resolve(__dirname, 'src/fonts'),
	],
	type: 'asset/resource',
	generator: {
		filename: 'src/fonts/[name].[hash][ext][query]',
	},
}

const plugins = [
	new HtmlWebpackPlugin({
		template: path.join(__dirname, 'index.html')
	}),
	new webpack.DefinePlugin({
		'__DEV__': JSON.stringify(isDev),
	}),
	new webpack.ProvidePlugin({
		process: 'process/browser',
	}),
	new Dotenv(),
	// new CopyPlugin({
	// 	patterns: [
	// 		{ from: path.resolve(__dirname, 'src/assets'), to: 'assets' },
	// 	],
	// }),
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
			babelLoaderConfig,
			fontLoaderConfig,
		],
	},
	plugins,
	resolve: {
		alias: {
			'react-native$': 'react-native-web',
			'react-native-safe-area-context': 'expo-dev-menu/vendored/react-native-safe-area-context/src',
			"@auth": path.resolve(__dirname, "../../packages/auth/src"),
			"@ui": path.resolve(__dirname, "../../packages/ui/src"),
			"types": path.resolve(__dirname, "../../packages/types/src"),
			"validation": path.resolve(__dirname, "../../packages/validation/src"),
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