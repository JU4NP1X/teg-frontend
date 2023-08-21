require('dotenv').config()
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const onHeaders = require('on-headers')

const path = require('path')
const app = express()
app.disable('x-powered-by')

// Sites with permissions on the page
const sites = [
  'google.com',
  'docs.google.com',
  'accounts.google.com',
  'app.powerbi.com',
  'learn.microsoft.com',
].join(' ')

const headers = {
  'X-Content-Type-Options': 'nosniff',
  'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
  'X-Frame-Options': 'deny',
  'Strict-Transport-Security': ' max-age=15552000; preload',
  'Content-Security-Policy':
    `default-src 'self' ${sites};` +
    ` object-src 'none'; ` +
    ` frame-ancestors 'none'; ` +
    // + `upgrade-insecure-requests; `
    // + `block-all-mixed-content; `
    `script-src 'self' ${sites}; ` +
    `style-src 'self' ${sites} 'sha256-lmto2U1o7YINyHPg9TOCjIt+o5pSFNU/T2oLxDPF+uw=' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=' 'sha256-Sum87kgnQMRwVw373ouovl3XXPWBaZ97zQXZQ2LK5Z8='; ` +
    `img-src 'self' ${sites} data:; ` +
    `media-src 'self' ${sites}; ` +
    `frame-src 'self' ${sites}; ` +
    `font-src 'self' ${sites}; ` +
    `connect-src 'self' ${sites}; ` +
    `form-action 'self' ${sites};`,
}

const unsetCacheHeaders = function () {
  this.removeHeader('Etag')
  this.removeHeader('Last-Modified')
  this.removeHeader('Date')
}

const setHeaders = function (res, path) {
  res.set(headers)
  onHeaders(res, unsetCacheHeaders)
}
app.use(
  process.env.VITE_PROXY_ENDPOINT,
  createProxyMiddleware({
    target: process.env.VITE_API_BASE_URL,
    changeOrigin: true,
    pathRewrite: { [process.env.VITE_PROXY_ENDPOINT]: '/' },
    onProxyRes: (proxyRes, req, res) => {
      res.removeHeader('Date')
    },
  })
)

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/dist', 'index.html'), {
    headers,
    lastModified: false,
    etag: false,
  })
})
app.get('/classify', function (req, res) {
  res.sendFile(path.join(__dirname, '/dist', 'index.html'), {
    headers,
    lastModified: false,
    etag: false,
  })
})
app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, '/dist', 'index.html'), {
    headers,
    lastModified: false,
    etag: false,
  })
})
app.get('/admin/*', function (req, res) {
  res.sendFile(path.join(__dirname, '/dist', 'index.html'), {
    headers,
    lastModified: false,
    etag: false,
  })
})

app.use(
  express.static(path.join(__dirname, '/dist'), {
    setHeaders: setHeaders,
  })
)

app.get('*', function (req, res) {
  setHeaders(res)
  res.status(404).send('')
})

const port = process.env.VITE_PORT || 80
app.listen(port)
