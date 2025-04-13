module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier'
    ],
    env: {
		es2021: true,
		node: true,
		browser: true
    },
    ignorePatterns: ['dist', 'build'],
    rules: {
		'@typescript-eslint/no-explicit-any': 'off'
    }
}