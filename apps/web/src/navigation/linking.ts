// apps/web/src/navigation/linking.ts

import type { LinkingOptions } from '@react-navigation/native'
import type { RootStackParamList } from '@iam/types'

export const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['http://localhost:3000', 'https://iameric.me'],
    config: {
        screens: {
            Chat: 'chat',
            ForgotPassword: 'forgot-password',
            Home: '',
            ResetPassword: 'reset-password/:token',
            Profile: {
                path: 'profile',
                screens: {
                    Main: '',
                    Images: 'images',
                },
            },
            PrivacyPolicy: 'privacy',
            Users: {
				path: 'users',
				screens: {
				  UserList: '',
				  User: {
					path: ':username',
					screens: {
					  UserProfile: '',
					  UserImages: 'images',
					},
				  },
				},
			},					
        },
    },
}
