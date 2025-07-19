// packages/types/src/navigation.types.ts

import type { NavigatorScreenParams } from '@react-navigation/native'

export type UserStackParamList = {
    UserList: undefined
    UserProfile: { username: string }
    UserImages: { username: string }
}

export type ProfileStackParamList = {
    Main: undefined
    Images: undefined
}

export type RootStackParamList = {
    Chat: undefined
    Feed: undefined
    ForgotPassword: { token: string }
    Home: undefined
    Profile: NavigatorScreenParams<ProfileStackParamList>
    PrivacyPolicy: undefined
    Protected: undefined
    ResetPassword: { token: string }
    Signin: undefined
    Users: NavigatorScreenParams<UserStackParamList>
}
