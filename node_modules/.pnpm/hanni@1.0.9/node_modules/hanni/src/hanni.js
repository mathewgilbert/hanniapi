import { Router } from './router.js'
import { createContext } from './context.js'
import { swaggerHTML } from './swagger.js'
import { buildSpec } from './openai.js'
import { scalarHTML } from './scalar.js'
import { compose } from './middleware.js'
import { parseBody, cors } from './utils.js'
import path from 'node:path'

export { Router } from './router.js'

export function Static(path, root) {
  if (path && typeof path === 'object' && !root) {
    return { __isStatic: true, ...path }
  }
  return { __isStatic: true, path, root }
}
export function Hanni(config = {}) {
  const router = new Router(config.router || {})
  const middlewares = []
  const staticRoutes = []
  const swaggerCfg = config.swagger || null
  const scalarCfg = config.scalar || null
  const corsEnabled = !!config.cors

  const app = {}

    ;['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'all'].forEach(method => {
      app[method] = (path, handler, meta = {}) => {
        router.add(method.toUpperCase(), path, handler, meta)
        return app
      }
    })

  app.use = (middleware) => {
    if (middleware && middleware.__isStatic) {
      staticRoutes.push({ prefix: middleware.path || '/', root: middleware.root })
    } else if (middleware && typeof middleware === 'object' && middleware.path && middleware.root) {
      staticRoutes.push({ prefix: middleware.path, root: middleware.root })
    } else {
      middlewares.push(middleware)
    }
    return app
  }

  app.route = (prefix, subRouter) => {
    if (subRouter instanceof Router) {
      subRouter.getRoutes().forEach(r => {
        router.add(r.method, prefix + (r.path === '/' ? '' : r.path), r.handler, r.meta)
      })
    }
    return app
  }

  app.static = (prefix, root) => {
    if (!root) {
      root = prefix
      prefix = '/'
    }
    if (!prefix.startsWith('/')) prefix = '/' + prefix
    staticRoutes.push({ prefix, root })
    return app
  }

  app.listen = (port = 3000, callback) => {
    const server = Bun.serve({
      port,
      async fetch(req) {
        const url = new URL(req.url)
        const pathname = url.pathname === '' ? '/' : url.pathname

        if (swaggerCfg) {
          const base = swaggerCfg.path || '/docs'
          if (pathname === base || pathname === base + '/') {
            return new Response(
              swaggerHTML(base + '/openapi.json', swaggerCfg),
              { headers: { 'Content-Type': 'text/html;charset=utf-8' } }
            )
          }
          if (pathname === base + '/openapi.json') {
            return Response.json(buildSpec(router.getRoutes(), swaggerCfg))
          }
        }

        if (scalarCfg) {
          const base = scalarCfg.path || '/reference'
          if (pathname === base || pathname === base + '/') {
            return new Response(
              scalarHTML(base + '/openapi.json', scalarCfg),
              { headers: { 'Content-Type': 'text/html;charset=utf-8' } }
            )
          }
          if (pathname === base + '/openapi.json') {
            return Response.json(buildSpec(router.getRoutes(), scalarCfg))
          }
        }

        if (corsEnabled && req.method === 'OPTIONS') {
          return new Response(null, { status: 204, headers: cors(config.cors) })
        }

        if (req.method === 'GET') {
          for (const s of staticRoutes) {
            if (pathname.startsWith(s.prefix)) {
              const rel = pathname.slice(s.prefix.length)
              const filePath = path.join(s.root, rel === '' ? 'index.html' : rel)
              const file = Bun.file(filePath)
              if (await file.exists()) return new Response(file)
            }
          }
        }

        const match = router.match(req.method, pathname)
        if (!match) return new Response('Not Found 🐰', { status: 404 })

        const ctx = createContext(req, match.params)
        try { ctx.body = await parseBody(req) } catch { ctx.body = null }

        try {
          const composed = compose(middlewares, match.handler)
          let response = await composed(ctx)
          if (corsEnabled && response) {
            const h = cors(config.cors)
            Object.entries(h).forEach(([k, v]) => response.headers.set(k, v))
          }
          return response || new Response('No Response', { status: 500 })
        } catch (err) {
          console.error(err)
          return new Response('Internal Server Error', { status: 500 })
        }
      }
    })
    if (callback) callback(server)
    return server
  }
  return app
}