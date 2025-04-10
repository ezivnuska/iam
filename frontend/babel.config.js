module.exports = {
    presets: [
        'module:metro-react-native-babel-preset',
    ],
    plugins: [
        [
            'module-resolver',
            {
                root: ['.'],
                alias: {
                    '@config':          './config.js',
                    '@components':      './src/components',
                },
            },
        ],
    ],
}