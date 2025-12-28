// src/context.js
export function createContext(req, params = {}) {
  const url = new URL(req.url)
  const headers = Object.fromEntries(req.headers.entries())
  const cookies = {}

  if (headers.cookie) {
    headers.cookie.split(';').forEach(c => {
      const [key, value] = c.trim().split('=')
      if (key && value) cookies[key] = decodeURIComponent(value)
    })
  }

  return {
    req,
    method: req.method,
    path: url.pathname,
    query: Object.fromEntries(url.searchParams),
    params,
    headers,
    cookies,
    body: null,

    async getBody() {
      if (this.body === null) {
        this.body = await req.text().catch(() => '')
      }
      return this.body
    },

    async jsonBody() {
      try {
        return await req.json()
      } catch {
        return null
      }
    },

    text(data, status = 200, headers = {}) {
      return new Response(data, { status, headers })
    },

    json(data, status = 200, headers = {}) {
      return Response.json(data, { status, headers })
    },

    html(data, status = 200, headers = {}) {
      return new Response(data, {
        status,
        headers: { 'Content-Type': 'text/html;charset=UTF-8', ...headers }
      })
    },

    redirect(location, status = 302) {
      return Response.redirect(location, status)
    }
  }
}