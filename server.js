const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// POST endpoint for analyzing input
app.post('/analyze', async (req, res) => {
    const userInput = req.body.input;

    const prompt = `Extract 3 short, clear YouTube search phrases based on this textbook content to help someone find relevant educational videos:\n\n"${userInput}"`;

    try {
        // Hugging Face inference call go
        const hfResponse = await axios.post(
            'https://api-inference.huggingface.co/models/google/flan-t5-base',
            { inputs: prompt },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const keywordText = hfResponse.data[0]?.generated_text || '';
        const query = encodeURIComponent(keywordText);

        // YouTube search
        const youtubeResponse = await axios.get(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=5&key=${process.env.YOUTUBE_API_KEY}`
        );

        const videos = youtubeResponse.data.items.map(item => ({
            title: item.snippet.title,
            videoId: item.id.videoId,
        }));

        res.json({ keywords: keywordText, videos });
    } catch (error) {
        console.error("Hugging Face or YouTube error:", error.response?.data || error.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));