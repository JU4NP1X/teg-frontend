require('dotenv').config()
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const onHeaders = require('on-headers')

const path = require('path')
const app = express()
app.disable('x-powered-by')

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/dist', 'index.html'))
})

const port = process.env.VITE_PORT || 80
app.listen(port)
