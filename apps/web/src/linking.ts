// apps/web/src/linking.ts

export const linking = {
    prefixes: ['http://localhost:3000', 'https://iameric.me'],
    config: {
        screens: {
            Chat: 'chat',
            Details: ':username',
            ForgotPassword: 'forgot-password',
            Home: '/',
            ResetPassword: 'reset-password/:token',
            UserList: 'users',
            Profile: 'profile',
            PrivacyPolicy: 'privacy',
        },
    },
}
