require('dotenv').config();
const axios = require('axios');

const HF_API_URL = 'https://api-inference.huggingface.co/models/MoritzLaurer/mDeBERTa-v3-base-mnli-xnli';

async function test() {
    try {
        const response = await axios.post(
            HF_API_URL,
            {
                inputs: "I want to learn how to build a robot",
                parameters: {
                    candidate_labels: ["technology", "robotics", "health", "music", "education"]
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_API_KEY}`
                }
            }
        );
        console.log(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
    }
}

test();