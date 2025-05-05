// apps/web/babel.config.js

const path = require('path')

module.exports = {
	presets: [
		'module:metro-react-native-babel-preset',
		'babel-preset-expo',
		['@babel/preset-typescript', { allowDeclareFields: true }],
		'@babel/preset-react',
	],
	plugins: [
		[
			'module-resolver',
			{
				alias: {
					'react-native': 'react-native-web',
					'react-native-vector-icons': '@expo/vector-icons',
					'@': path.resolve(__dirname, './src'),
					'@auth': path.resolve(__dirname, '../../packages/auth/src'),
					'@services': path.resolve(__dirname, '../../packages/services/src'),
					'@iam/types': path.resolve(__dirname, '../../packages/types/src'),
				},
				extensions: ['.web.js', '.js', '.web.ts', '.ts', '.web.tsx', '.tsx', '.json'],
			},
		],
		'react-native-web',
		'react-native-reanimated/plugin', // must be last in the list per reanimated docs
	],
}