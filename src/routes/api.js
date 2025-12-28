import { Router } from 'hanni'
import * as utils from '../utils/index.js'

const router = new Router()

router.get(
    '/downloader/tiktok',
    async (c) => {
        const { url } = c.query

        if (!url) {
            return c.json(
                { success: false, error: 'URL is required' },
                400
            )
        }

        try {
            const result = await utils.ttdl.video(url)
            return c.json({
                success: true,
                result
            })
        } catch (err) {
            return c.json(
                { success: false, error: err.message },
                500
            )
        }
    },
    {
        meta: {
            summary: 'TikTok Downloader',
            description: 'Download TikTok video without watermark using URL',
            tags: ['Downloader'],

            query: {
                url: {
                    type: 'string',
                    required: true,
                    description: 'TikTok video URL',
                    example: 'https://www.tiktok.com/@keisxi_/video/7362165086829546770'
                }
            },

            response: {
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    result: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            duration: { type: 'number' },
                            thumbnail: { type: 'string' },
                            nowm: { type: 'string' },
                            wm: { type: 'string' },
                            music: { type: 'string' }
                        }
                    },
                    error: { type: 'string' }
                }
            }
        }
    }
)

export default router
