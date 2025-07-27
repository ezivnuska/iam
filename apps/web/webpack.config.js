// apps/web/webpack.config.js (CommonJS version)

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
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
		path.resolve(__dirname, '../../packages/theme/src'),
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
		'expo-camera',
		'expo-image',
        '@react-native/assets-registry',
        '@expo/vector-icons',
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
		app: path.join(__dirname, 'src/app/index.ts'),
	},
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },    
    optimization: {
        minimize: process.env.NODE_ENV === 'production',
        minimizer: [new TerserPlugin({
            terserOptions: {
                // compress: {
                //     drop_console: true,
                // },
            },
        })],
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
            'react': path.resolve(__dirname, '../../node_modules/react'),
            'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
            'react/jsx-runtime': path.resolve(__dirname, '../../node_modules/react/jsx-runtime'),
			'react-native$': 'react-native-web',
			// 'react-native-vector-icons': '@expo/vector-icons',
			'@iam/auth': path.resolve(__dirname, '../../packages/auth/src'),
			'@iam/services': path.resolve(__dirname, '../../packages/services/src'),
			'@iam/types': path.resolve(__dirname, '../../packages/types/src'),
			'@iam/utils': path.resolve(__dirname, '../../packages/utils/src'),
			'@iam/theme': path.resolve(__dirname, '../../packages/theme/src'),
			// '@': path.resolve(__dirname, 'src'),

            '@app': path.resolve(__dirname, 'src/app'),
            '@features': path.resolve(__dirname, 'src/features'),
            '@shared': path.resolve(__dirname, 'src/shared'),
            '@assets': path.resolve(__dirname, 'src/shared/assets'),
            '@hoc': path.resolve(__dirname, 'src/shared/hoc'),
            '@components': path.resolve(__dirname, 'src/shared/ui'),
            '@buttons': path.resolve(__dirname, 'src/shared/buttons'),
            '@forms': path.resolve(__dirname, 'src/shared/forms'),
            '@layout': path.resolve(__dirname, 'src/shared/layout'),
            '@media': path.resolve(__dirname, 'src/shared/media'),
            '@modals': path.resolve(__dirname, 'src/shared/modals'),
            '@hooks': path.resolve(__dirname, 'src/shared/hooks'),
            // '@utils': path.resolve(__dirname, 'src/shared/utils'),
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
    devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
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
