// apps/web/babel.config.js

const path = require('path')

module.exports = {
	presets: [
		'module:metro-react-native-babel-preset',
		'babel-preset-expo',
		['@babel/preset-typescript', { allowDeclareFields: true }],
		'@babel/preset-react',
        '@babel/preset-env',
	],
	plugins: [
		[
			'module-resolver',
			{
				alias: {
					'react-native': 'react-native-web',
					// 'react-native-vector-icons': '@expo/vector-icons',
					'@': path.resolve(__dirname, './src'),
					'@auth': path.resolve(__dirname, '../../packages/auth/src'),
					'@services': path.resolve(__dirname, '../../packages/services/src'),
					'@utils': path.resolve(__dirname, '../../packages/utils/src'),
					'@iam/types': path.resolve(__dirname, '../../packages/types/src'),
					'@iam/theme': path.resolve(__dirname, '../../packages/theme/src'),
				},
				extensions: ['.web.js', '.js', '.web.ts', '.ts', '.web.tsx', '.tsx', '.json'],
			},
		],
		'react-native-web',
        '@babel/plugin-proposal-optional-chaining', // explicitly support optional chaining
        // Ensure consistent 'loose' mode across related plugins
        ['@babel/plugin-transform-class-properties', { loose: true }],
        ['@babel/plugin-transform-private-methods', { loose: true }],
        ['@babel/plugin-transform-private-property-in-object', { loose: true }],
		'react-native-reanimated/plugin', // must be last in the list per reanimated docs
	],
}