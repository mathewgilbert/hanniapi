// src/utils.js
export async function parseBody(req) {
  const contentType = req.headers.get('content-type') || ''

  try {
    if (contentType.includes('application/json')) {
      return await req.json()
    }

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await req.text()
      return Object.fromEntries(new URLSearchParams(text))
    }

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const result = {}
      for (const [key, value] of formData) {
        result[key] = value
      }
      return result
    }

    if (contentType.includes('text/') || contentType.includes('application/xml')) {
      return await req.text()
    }

    return null
  } catch {
    return null
  }
}

export function cors(options = {}) {
  const {
    origin = '*',
    methods = 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders = 'Content-Type, Authorization, X-Requested-With',
    exposedHeaders = 'Content-Length, X-Request-ID',
    credentials = false,
    maxAge = 86400
  } = options

  const headers = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': allowedHeaders,
    'Access-Control-Expose-Headers': exposedHeaders,
    'Access-Control-Max-Age': maxAge.toString()
  }

  if (credentials) {
    headers['Access-Control-Allow-Credentials'] = 'true'
  }

  return headers
}

export function logger(ctx, next) {
  const start = Date.now()
  return next().then(() => {
    const duration = Date.now() - start
    console.log(`${ctx.method} ${ctx.path} - ${ctx.res?.status || 0} - ${duration}ms`)
  }).catch(err => {
    console.error(`${ctx.method} ${ctx.path} - ERROR - ${err.message}`)
    throw err
  })
}

export function jsonParser(ctx, next) {
  if (ctx.req.headers.get('content-type')?.includes('application/json')) {
    return ctx.req.json()
      .then(body => {
        ctx.body = body
        return next()
      })
      .catch(() => next())
  }
  return next()
}