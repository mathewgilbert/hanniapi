import axios from 'axios';

/**
 * Generate image from text prompt
 * @param {string} prompt - Text prompt
 * @param {object} options - Options { style, width, height }
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
async function text2image(prompt, options = {}) {
    if (!prompt) return { success: false, error: "Prompt is required" }

    const {
        style = 'anime',
        width = 1024,
        height = 1024
    } = options

    try {
        // request ke Hanni local server
        const res = await axios.post(
            'http://localhost:3000/text2image',
            { prompt, style, width, height },
            { headers: { 'Content-Type': 'application/json' } }
        )

        const data = res.data

        if (!data || !data.success || !data.url) {
            return { success: false, error: "Failed to generate image" }
        }

        return { success: true, url: data.url }

    } catch (e) {
        console.error("Hanni text2image error:", e.message)

        // fallback ke API eksternal
        try {
            const apiUrl = `https://apis-sandarux.zone.id/api/aimage/text2img?prompt=${encodeURIComponent(prompt)}`
            const { data } = await axios.get(apiUrl)

            if (!data || !data.status || !data.image) {
                return { success: false, error: "Failed to generate image (fallback)" }
            }

            return { success: true, url: data.image }

        } catch (err) {
            console.error("Fallback API error:", err.message)
            return { success: false, error: "Something went wrong while generating the image" }
        }
    }
}

export default text2image