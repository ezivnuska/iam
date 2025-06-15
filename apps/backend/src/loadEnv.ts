// apps/backend/src/loadEnv.ts

import dotenv from 'dotenv'
import path from 'path'

const env = process.env.NODE_ENV || 'development'
const localPath = path.resolve(__dirname, `../.env.${env}`)
const fallbackPath = path.resolve(__dirname, `../../../.env.${env}`)

if (!dotenv.config({ path: localPath }).parsed) {
	dotenv.config({ path: fallbackPath })
}