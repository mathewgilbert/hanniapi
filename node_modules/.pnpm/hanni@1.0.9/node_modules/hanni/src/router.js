// src/router.js
export class Router {
  constructor(options = {}) {
    this.routes = []
    this.prefix = options.prefix || ''
  }

  add(method, path, handler, meta = {}) {
    let fullPath = this.prefix + path
    if (fullPath === '' || fullPath === '/') {
      fullPath = '/'
    }

    const keys = []
    let pattern = fullPath.replace(/:([^/]+)/g, (_, key) => {
      keys.push(key)
      return '([^/]+)'
    })

    pattern = pattern.replace(/\//g, '\\/')

    let regexStr = '^' + pattern + '$'
    if (fullPath === '/') {
      regexStr = '^(?:\\/)?$'
    }

    const regex = new RegExp(regexStr)

    this.routes.push({
      method: method.toUpperCase(),
      path: fullPath,
      regex,
      keys,
      handler,
      meta
    })

    return this
  }

  get(path, handler, meta) {
    return this.add('GET', path, handler, meta)
  }

  post(path, handler, meta) {
    return this.add('POST', path, handler, meta)
  }

  put(path, handler, meta) {
    return this.add('PUT', path, handler, meta)
  }

  delete(path, handler, meta) {
    return this.add('DELETE', path, handler, meta)
  }

  patch(path, handler, meta) {
    return this.add('PATCH', path, handler, meta)
  }

  all(path, handler, meta) {
    return this.add('ALL', path, handler, meta)
  }

  match(method, pathname) {
    method = method.toUpperCase()

    let normalizedPath = pathname
    if (normalizedPath === '') normalizedPath = '/'

    for (const route of this.routes) {
      if (route.method !== method && route.method !== 'ALL') continue

      const match = normalizedPath.match(route.regex)
      if (!match) continue

      const params = {}
      route.keys.forEach((key, i) => {
        params[key] = match[i + 1]
      })

      return {
        handler: route.handler,
        params,
        meta: route.meta
      }
    }

    return null
  }

  getRoutes() {
    return this.routes
  }
}