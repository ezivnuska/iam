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
                "@navigation": path.resolve(__dirname, "../../packages/navigation/src"),
                "@screens": path.resolve(__dirname, "../../packages/screens/src"),
                "@services": path.resolve(__dirname, "../../packages/services/src"),
                "@types": path.resolve(__dirname, "../../packages/types/src"),
                "@ui": path.resolve(__dirname, "../../packages/ui/src"),
                "@validation": path.resolve(__dirname, "../../packages/validation/src"),
            },
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        }],
    ],
}