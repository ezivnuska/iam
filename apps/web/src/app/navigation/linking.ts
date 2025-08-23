// apps/web/src/app/navigation/linking.ts

import type { LinkingOptions } from '@react-navigation/native'
import type { RootStackParamList } from '@iam/types'

export const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['http://localhost:3000', 'https://iameric.me'],
    config: {
        screens: {
            Chat: {
                path: 'chat',
                screens: {
                    Main: '',
                },
            },
            ForgotPassword: 'forgot-password',
            Feed: {
                path: 'feed',
                screens: {
                    FeedList: '',
                },
            },
            Memories: {
                path: 'memories',
                screens: {
                    MemoryList: '',
                },
            },
            Home: '',
            Tiles: 'tiles',
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
                            Main: '',
                            UserImages: 'images',
                        },
                    },
                },
            },
        },
    },
}
