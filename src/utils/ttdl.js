import axios from "axios";

const ttdl = {
    video: async function (url) {
        if (!url) throw new Error("URL is required");

        try {
            const apiUrl = `https://apis.sandarux.sbs/api/tiktok/tiktokdl?url=${encodeURIComponent(url)}`;
            const { data } = await axios.get(apiUrl);

            if (!data || !data.status || !data.result) {
                throw new Error("Failed to fetch TikTok video info");
            }

            const result = data.result;

            return {
                type: "video",
                title: result.title,
                creator: data.creator,
                duration: result.duration,
                caption: result.caption,
                thumbnail: result.thumbnail,
                video: {
                    wm: result.wm,
                    nowm: result.nowm,
                    hd: result.nowatermark_hd
                },
                music: result.music,
                stats: result.stats
            };
        } catch (err) {
            console.error("TikTok Downloader Error:", err.message || err);
            throw err;
        }
    }
};

export default ttdl;