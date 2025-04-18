const path = require('path')

module.exports = {
    presets: [
        'babel-preset-expo',
        ['@babel/preset-typescript', { allowDeclareFields: true }],
    ],
    plugins: [
        ['module-resolver', {
            alias: {
                'react-native': 'react-native-web',
                "@auth": path.resolve(__dirname, "../../packages/auth/src"),
                "@ui": path.resolve(__dirname, "../../packages/ui/src"),
                "@types": path.resolve(__dirname, "../../packages/types/src"),
                "validation": path.resolve(__dirname, "../../packages/validation/src"),
            },
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        }],
    ],
}