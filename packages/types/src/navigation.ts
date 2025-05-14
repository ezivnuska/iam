// packages/types/src/navigation.ts

export type RootStackParamList = {
    Chat: undefined
    Details: { id: string }
    ForgotPassword: { token: string }
    Home: undefined
    Profile: undefined
    Protected: undefined
    ResetPassword: { token: string }
    Signin: undefined
    Signup: undefined
    UserList: undefined
}