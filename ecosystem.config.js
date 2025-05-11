// ecosystem.config.js

module.exports = {
    apps: [
		{
			name: 'iam-backend',
			script: './apps/backend/build/index.js',
			interpreter: `${process.env.HOME}/.nvm/versions/node/v22.14.0/bin/node`,
			cwd: "/var/www/iam",
            watch: false,
            env: {
                NODE_ENV: "production",
            },
		},
		{
			name: 'iam-webhook',
			script: './scripts/webhook.js',
			interpreter: `${process.env.HOME}/.nvm/versions/node/v22.14.0/bin/node`,
            cwd: "/var/www/iam",
			env: {
				NODE_ENV: 'production',
			},
		},
    ],
}