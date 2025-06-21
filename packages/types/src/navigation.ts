// packages/types/src/navigation.ts

export type RootStackParamList = {
    Chat: undefined
    Details: { username: string }
    Feed: undefined
    ForgotPassword: { token: string }
    Home: undefined
    Profile: undefined
    PrivacyPolicy: undefined
    Protected: undefined
    ResetPassword: { token: string }
    Signin: undefined
    UserList: undefined
}