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
					// '@': path.resolve(__dirname, './src'),
					'@iam/auth': path.resolve(__dirname, '../../packages/auth/src'),
					'@iam/services': path.resolve(__dirname, '../../packages/services/src'),
					'@iam/utils': path.resolve(__dirname, '../../packages/utils/src'),
					'@iam/types': path.resolve(__dirname, '../../packages/types/src'),
					'@iam/theme': path.resolve(__dirname, '../../packages/theme/src'),

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
				extensions: ['.web.js', '.js', '.web.ts', '.ts', '.web.tsx', '.tsx', '.json'],
			},
		],
		'react-native-web',
        '@babel/plugin-proposal-optional-chaining', // explicitly support optional chaining
        // Ensure consistent 'loose' mode across related plugins
        ['@babel/plugin-transform-class-properties', { loose: true }],
        ['@babel/plugin-transform-private-methods', { loose: true }],
        ['@babel/plugin-transform-private-property-in-object', { loose: true }],
        '@babel/plugin-proposal-export-namespace-from',
        'react-native-worklets/plugin', // must be last in the list per reanimated docs
		// 'react-native-reanimated/plugin', // must be last in the list per reanimated docs
	],
}