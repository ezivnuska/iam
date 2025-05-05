// apps/web/src/index.ts

import { registerRootComponent } from 'expo'
import App from './app'

export * from './hooks'
export * from './types'
export * from './utils'

registerRootComponent(App)