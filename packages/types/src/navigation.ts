// packages/types/src/navigation.ts

export type RootStackParamList = {
    Chat: undefined
    Details: { id: string }
    Feed: undefined
    ForgotPassword: { token: string }
    Home: undefined
    Profile: undefined
    Protected: undefined
    ResetPassword: { token: string }
    UserList: undefined
}