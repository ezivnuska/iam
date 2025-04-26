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
	'react-native-screens',
	'react-native-safe-area-context',
	'react-native-gesture-handler',
	'react-native-reanimated',
	'react-native-pager-view',
	'react-native-vector-icons',
].map(moduleName => path.resolve(__dirname, `node_modules/${moduleName}`));

const babelLoaderConfig = {
	test: /\.[jt]sx?$/,
	// Add every directory that needs to be compiled by Babel during the build.
	include: (filepath) => {
		const sourcesToCompile = [
			path.resolve(__dirname, 'src'),
			path.resolve(__dirname, '../../packages/ui/src'),
			path.resolve(__dirname, '../../packages/auth/src'),
			path.resolve(__dirname, '../../packages/navigation/src'),
			path.resolve(__dirname, '../../packages/providers/src'),
			path.resolve(__dirname, '../../packages/screens/src'),
			path.resolve(__dirname, '../../packages/services/src'),
			path.resolve(__dirname, '../../packages/types/src'),
			path.resolve(__dirname, '../../packages/validation/src'),
			...compileNodeModules,
		]

		return sourcesToCompile.some(srcPath => filepath.startsWith(srcPath)) ||
			filepath.includes(`node_modules/expo/`) ||
			filepath.includes(`node_modules/expo-modules-core/`) ||
			filepath.includes(`node_modules/expo-secure-store/`) ||
            filepath.includes(`node_modules/react-native-reanimated/`)
	},
	use: {
		loader: 'babel-loader',
		options: {
			presets: [
				"babel-preset-expo",
				['@babel/preset-typescript', { allowDeclareFields: true }],
			],
		},
	},
}

const imageLoaderConfig = {
	test: /\.(png|jpe?g|gif|svg)$/i,
	// include: [
	// 	path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
	// 	path.resolve(__dirname, 'src/fonts'),
	// ],
	type: 'asset/resource',
	// generator: {
	// 	filename: 'src/fonts/[name].[hash][ext][query]',
	// },
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
	new Dotenv({
		path: path.resolve(__dirname, '.env'), // frontend-safe env
		systemvars: true // optionally also pull from process.env
	}),
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
			{
				test: /\.js$/,
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
			'react-native-safe-area-context': 'react-native-safe-area-context',
			// 'react-native-safe-area-context': 'expo-dev-menu/vendored/react-native-safe-area-context/src',
			"@auth": path.resolve(__dirname, "../../packages/auth/src"),
			"@navigation": path.resolve(__dirname, "../../packages/navigation/src"),
			"@providers": path.resolve(__dirname, "../../packages/providers/src"),
			"@screens": path.resolve(__dirname, "../../packages/screens/src"),
			"@services": path.resolve(__dirname, "../../packages/services/src"),
			"@iam/types": path.resolve(__dirname, "../../packages/types/src"),
			"@ui": path.resolve(__dirname, "../../packages/ui/src"),
			"@validation": path.resolve(__dirname, "../../packages/validation/src"),
		},
		extensions: [
			// '.mjs',
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
		// fullySpecified: false,
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