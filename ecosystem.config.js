// ecosystem.config.js

module.exports = {
    apps: [
		{
			name: 'iam-backend',
			script: 'apps/backend/build/index.js',
			interpreter: `${process.env.HOME}/.nvm/versions/node/v22.14.0/bin/node`,
			env: {
				NODE_ENV: 'development',
			},
			env_production: {
				NODE_ENV: 'production',
			},
		},
		{
			name: 'iam-webhook',
			script: 'scripts/webhook.js',
			interpreter: `${process.env.HOME}/.nvm/versions/node/v22.14.0/bin/node`,
			env: {
				NODE_ENV: 'development',
			},
			env_production: {
				NODE_ENV: 'production',
			},
		},
    ],
}