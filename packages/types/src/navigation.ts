// packages/types/src/navigation.ts

export type RootStackParamList = {
    Details: { id: string }
    ForgotPassword: { token: string }
    Home: undefined
    Signin: undefined
    Signup: undefined
    ResetPassword: { token: string }
    UserList: undefined
    Protected: undefined
}