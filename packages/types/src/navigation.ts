// packages/types/src/navigation.ts

export type RootStackParamList = {
    Details: { id: string }
    ForgotPassword: { token: string }
    Home: undefined
    Login: undefined
    Register: undefined
    ResetPassword: { token: string }
}