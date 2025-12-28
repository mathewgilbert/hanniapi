// src/middleware.js
export function compose(middlewares, finalHandler) {
  return function (ctx) {
    let index = -1

    function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i

      const fn = i === middlewares.length ? finalHandler : middlewares[i]
      if (!fn) return Promise.resolve()

      try {
        return Promise.resolve(fn(ctx, () => dispatch(i + 1)))
      } catch (err) {
        return Promise.reject(err)
      }
    }

    return dispatch(0)
  }
}