// packages/types/src/navigation.types.ts

import type { NavigatorScreenParams } from '@react-navigation/native'

/**
 * Screens related to a user's profile
 */
export type UserProfileStackParamList = {
    UserProfile: undefined
    UserImages: undefined
}  

/**
 * Screens under the Users tab
 * Includes UserList and a nested navigator for user profile screens
 */
export type UserStackParamList = {
    UserList: undefined
    User?: { screen: string, username: string | undefined }
}

/**
 * Screens under the Profile tab
 */
export type ProfileStackParamList = {
    Main: undefined
    Images: undefined
}

/**
 * Root navigation structure
 */
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

/**
 * Utility type for deep navigation.
 * Example:
 * navigateTo('Users', { screen: 'UserProfileNavigator', params: { screen: 'UserProfile', params: { username: 'eric' } } })
 */
export type RootNavigatorParams =
    | { screen: keyof RootStackParamList; params?: any }
