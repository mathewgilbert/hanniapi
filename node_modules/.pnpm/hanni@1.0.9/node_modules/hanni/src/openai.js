// src/swagger.js
const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']

function normalizePath(path) {
    return path.replace(/:([^/]+)/g, '{$1}')
}

function extractPathParams(path) {
    const params = []
    path.replace(/:([^/]+)/g, (_, k) => {
        params.push({
            name: k,
            in: 'path',
            required: true,
            schema: { type: 'string' }
        })
    })
    return params
}

function extractQueryParams(meta) {
    if (!meta?.query) return []
    return Object.keys(meta.query).map(k => {
        const config = meta.query[k] || {}
        const isObj = typeof config === 'object'
        return {
            name: k,
            in: 'query',
            description: isObj ? config.description : '',
            required: isObj ? !!config.required : false,
            schema: {
                type: (isObj && config.type) ? config.type : 'string',
                default: (isObj && config.default) ? config.default : undefined,
                example: (isObj && config.example) ? config.example : undefined
            },
            example: (isObj && config.example) ? config.example : undefined
        }
    })
}

function buildRequestBody(meta, method) {
    if (!meta?.body) return undefined
    if (method === 'get' || method === 'head') return undefined
    return {
        required: true,
        content: {
            'application/json': {
                schema: meta.body
            }
        }
    }
}

export function buildSpec(routes, cfg = {}) {
    const paths = {}
    const tagsMap = new Map()

    for (const r of routes) {
        const rawMeta = r.meta || {}
        const meta = (rawMeta.meta && typeof rawMeta.meta === 'object')
            ? { ...rawMeta, ...rawMeta.meta }
            : rawMeta

        if (meta.swagger === false || meta.hidden === true) continue

        const openPath = normalizePath(r.path || '/')
        if (!paths[openPath]) paths[openPath] = {}

        const methods = r.method === 'ALL' ? HTTP_METHODS : [r.method.toLowerCase()]

        let tags = []
        if (Array.isArray(meta.tags)) tags = meta.tags
        else if (typeof meta.tags === 'string') tags = [meta.tags]
        else tags = ['Default']

        tags.forEach(t => {
            if (!tagsMap.has(t)) tagsMap.set(t, { name: t })
        })

        for (const method of methods) {
            paths[openPath][method] = {
                tags,
                summary: meta.summary || `${method.toUpperCase()} ${r.path}`,
                description: meta.description || 'No description provided',
                parameters: [
                    ...extractPathParams(r.path),
                    ...extractQueryParams(meta)
                ],
                requestBody: buildRequestBody(meta, method),
                responses: {
                    200: {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: meta.response || { type: 'object' }
                            }
                        }
                    }
                }
            }
        }
    }

    return {
        openapi: '3.0.3',
        info: {
            title: cfg.title || 'Hanni API',
            version: cfg.version || '1.0.0',
            description: cfg.description || ''
        },
        tags: Array.from(tagsMap.values()),
        paths
    }
}

