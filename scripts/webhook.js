// scripts/webhook.js

const express = require('express')
const { exec } = require('child_process')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const path = require('path')

// Load .env from the same directory as this script
require('dotenv').config({
    path: path.join(__dirname, '.env'),
})

const app = express()
const port = 9000
const GITHUB_SECRET = process.env.GITHUB_SECRET

if (!GITHUB_SECRET) {
    console.warn('⚠️  Warning: GITHUB_SECRET is not set in scripts/.env')
}

// GitHub requires raw body for signature verification
app.use(bodyParser.raw({ type: '*/*' }))

// Validate webhook signature
const verifySignature = (req) => {
    const signature = req.headers['x-hub-signature-256']
    if (!signature) return false

    const hash = crypto
        .createHmac('sha256', GITHUB_SECRET)
        .update(req.body)
        .digest('hex')

    return signature === `sha256=${hash}`
}

app.post('/webhook', (req, res) => {
    if (!verifySignature(req)) {
        console.warn('⚠️ Invalid signature received')
        return res.status(400).send('Invalid signature')
    }

    let payload
    try {
        payload = JSON.parse(req.body.toString())
    } catch (err) {
        console.error('❌ Failed to parse payload:', err.message)
        return res.status(400).send('Malformed payload')
    }

    const branch = payload?.ref
    console.log(`ℹ️ Received push to ${branch}`)

    if (branch === 'refs/heads/main') {
        console.log('🚀 Push to main detected, starting deployment...')
        exec('/var/www/iam/deploy.sh >> /var/www/iam/scripts/deploy.log 2>&1', (err, stdout, stderr) => {
            if (err) {
                console.error('❌ Deployment error:', err.message)
                console.error('STDERR:', stderr)
                console.error('STDOUT:', stdout)
                return res.status(500).send('Deployment failed')
            }
            console.log('✅ Deployment output:\n', stdout)
            res.status(200).send('Deployment triggered')
        })
    } else {
        console.log('ℹ️ Push was not to main, ignoring.')
        res.status(204).send('Not main branch, ignored.')
    }
})

app.listen(port, () => {
    console.log(`✅ Webhook listener running on port ${port}`)
})