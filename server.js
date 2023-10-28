require('dotenv').config()
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')

const path = require('path')
const app = express()
app.use(
  process.env.VITE_PROXY_ENDPOINT,
  createProxyMiddleware({
    target: process.env.VITE_API_BASE_URL,
    changeOrigin: true,
    pathRewrite: { [process.env.VITE_PROXY_ENDPOINT]: '/' },
  })
)
app.use(express.static(path.join(__dirname, '/dist')))

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/dist', 'index.html'))
})

const port = process.env.VITE_PORT || 80
app.listen(port)
