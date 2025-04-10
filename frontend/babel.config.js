module.exports = {
    presets: [
        'module:metro-react-native-babel-preset',
    ],
    plugins: [
        [
            'module-resolver',
            {
                root: ['./'],
                alias: {
                    '@config':          './config',
                    '@components':      './src/components',
                    '@grid':            './src/components/Grid',
                    '@utils':           './src/components/Grid/utils',
                },
            },
        ],
    ],
}